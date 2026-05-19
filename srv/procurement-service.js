const cds = require('@sap/cds');

module.exports = cds.service.impl(async function () {
  const { PurchaseRequests, Products } = this.entities;

  // Status color coding for Fiori UI (criticality)
  this.after('READ', 'PurchaseRequests', (rows) => {
    const map = {
      Draft:    0,
      Pending:  2,
      Approved: 3,
      Ordered:  3,
      Received: 3,
      Rejected: 1,
      Closed:   3
    };
    const arr = Array.isArray(rows) ? rows : [rows];
    arr.forEach(r => { if (r) r.criticality = map[r.status] != null ? map[r.status] : 0; });
  });

  // Pure business logic helpers
  function determineRequiredApprover(amount) {
    if (amount == null || amount < 0) return null;
    if (amount < 1000) return 'AUTO_APPROVE';
    if (amount < 5000) return 'MANAGER';
    return 'DIRECTOR';
  }

  function isAllowedTransition(from, to) {
    const allowed = {
      Draft:    ['Pending'],
      Pending:  ['Approved', 'Rejected'],
      Approved: ['Ordered'],
      Ordered:  ['Received'],
      Received: ['Closed'],
      Rejected: [],
      Closed:   []
    };
    return (allowed[from] || []).includes(to);
  }

  // Auto-calculate totalAmount on CREATE / UPDATE
  this.before(['CREATE', 'UPDATE'], 'PurchaseRequests', async (req) => {
    const { product_ID, quantity } = req.data;

    if (product_ID && quantity != null) {
      const product = await SELECT.one.from(Products).where({ ID: product_ID });
      if (!product) {
        return req.error(400, 'Product ' + product_ID + ' does not exist', 'product_ID');
      }
      req.data.totalAmount = Number((product.price * quantity).toFixed(2));
    }

    if (quantity != null && quantity < 1) {
      return req.error(400, 'Quantity must be at least 1', 'quantity');
    }
  });

  // Block illegal status changes on UPDATE
  this.before('UPDATE', 'PurchaseRequests', async (req) => {
    if (req.data.status === undefined) return;

    const existing = await SELECT.one.from(PurchaseRequests).where({ ID: req.data.ID });
    if (!existing) return;

    const from = existing.status;
    const to   = req.data.status;
    if (from !== to && !isAllowedTransition(from, to)) {
      return req.error(400, 'Illegal status transition: ' + from + ' -> ' + to, 'status');
    }
  });

  // Action: submit()
  this.on('submit', 'PurchaseRequests', async (req) => {
    const { ID } = req.params[0];
    const pr = await SELECT.one.from(PurchaseRequests).where({ ID });
    if (!pr) return req.error(404, 'PurchaseRequest ' + ID + ' not found');
    if (pr.status !== 'Draft') {
      return req.error(400, 'Only Draft requests can be submitted (current: ' + pr.status + ')');
    }

    const approver = determineRequiredApprover(pr.totalAmount);
    const newStatus = approver === 'AUTO_APPROVE' ? 'Approved' : 'Pending';

    await UPDATE(PurchaseRequests).set({ status: newStatus }).where({ ID });
    return await SELECT.one.from(PurchaseRequests).where({ ID });
  });

  // Action: approve()
  this.on('approve', 'PurchaseRequests', async (req) => {
    const { ID } = req.params[0];
    const pr = await SELECT.one.from(PurchaseRequests).where({ ID });
    if (!pr) return req.error(404, 'PurchaseRequest ' + ID + ' not found');
    if (pr.status !== 'Pending') {
      return req.error(400, 'Only Pending requests can be approved (current: ' + pr.status + ')');
    }
    await UPDATE(PurchaseRequests).set({ status: 'Approved' }).where({ ID });
    return await SELECT.one.from(PurchaseRequests).where({ ID });
  });

  // Action: reject(reason)
  this.on('reject', 'PurchaseRequests', async (req) => {
    const { ID } = req.params[0];
    const { reason } = req.data;
    const pr = await SELECT.one.from(PurchaseRequests).where({ ID });
    if (!pr) return req.error(404, 'PurchaseRequest ' + ID + ' not found');
    if (pr.status !== 'Pending') {
      return req.error(400, 'Only Pending requests can be rejected (current: ' + pr.status + ')');
    }
    const notes = reason ? ((pr.notes || '') + '\n[Rejected] ' + reason).trim() : pr.notes;
    await UPDATE(PurchaseRequests).set({ status: 'Rejected', notes }).where({ ID });
    return await SELECT.one.from(PurchaseRequests).where({ ID });
  });

  // Function: getRequiredApprover(amount)
  this.on('getRequiredApprover', async (req) => {
    return determineRequiredApprover(req.data.amount);
  });
});
