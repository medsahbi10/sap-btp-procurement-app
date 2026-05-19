 namespace procurement;

  using { cuid, managed } from '@sap/cds/common';

  /**
   * Vendor master data — the suppliers who provide products.
   */
  entity Vendors : cuid {
    name     : String(100) not null;
    email    : String(100);
    country  : String(50);
    category : String(50);
    isActive : Boolean default true;
  }

  /**
   * Product master data — items that can be requested.
   */
  entity Products : cuid {
    name        : String(100) not null;
    description : String(500);
    price       : Decimal(9, 2) not null;
    unit        : String(20) default 'piece';
    category    : String(50);
  }

  /**
   * Purchase Request — transactional document submitted by an employee.
   */
  entity PurchaseRequests : cuid {
    requestedBy : String(100) not null;
    vendor      : Association to Vendors;
    product     : Association to Products;
    quantity    : Integer not null default 1;
    totalAmount : Decimal(11, 2);
    status      : String(20) default 'Draft';
    requestDate : Date default $now;
    notes       : String(500);
  }