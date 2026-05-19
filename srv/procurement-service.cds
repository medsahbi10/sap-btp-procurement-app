using procurement from '../db/schema';

  /**
   * Procurement Service — exposes all three entities as OData v4.
   */
  service ProcurementService @(path: '/procurement') {

    entity Vendors          as projection on procurement.Vendors;
    entity Products         as projection on procurement.Products;
    entity PurchaseRequests as projection on procurement.PurchaseRequests;

  }