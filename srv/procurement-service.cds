using procurement from '../db/schema';

  /**
   * Procurement Service — exposes all three entities as OData v4
   * and adds custom actions for the approval workflow.
   */
  service ProcurementService @(path: '/procurement') {

    entity Vendors  as projection on procurement.Vendors;
    entity Products as projection on procurement.Products;

  
    entity PurchaseRequests as projection on procurement.PurchaseRequests
    actions {
      action submit()  returns PurchaseRequests;
      action approve() returns PurchaseRequests;
      action reject(reason: String) returns PurchaseRequests;
    }

    // Read-only helper: who has to approve a given amount?
    function getRequiredApprover(amount: Decimal) returns String;
  }