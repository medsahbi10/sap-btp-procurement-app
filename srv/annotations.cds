using ProcurementService from './procurement-service';

annotate ProcurementService.PurchaseRequests with @(
  UI: {
    HeaderInfo: {
      TypeName       : 'Purchase Request',
      TypeNamePlural : 'Purchase Requests',
      Title          : { Value: requestedBy },
      Description    : { Value: notes }
    },
    LineItem: [
      { Value: requestedBy,  Label: 'Requested By' },
      { Value: vendor.name,  Label: 'Vendor' },
      { Value: product.name, Label: 'Product' },
      { Value: quantity,     Label: 'Qty' },
      { Value: totalAmount,  Label: 'Total Amount' },
      { Value: status,       Label: 'Status', Criticality: criticality },
      { Value: requestDate,  Label: 'Request Date' }
    ],
    SelectionFields: [ status, requestDate ],
    Facets: [
      { $Type  : 'UI.ReferenceFacet',
        Label  : 'General Information',
        Target : '@UI.FieldGroup#General' },
      { $Type  : 'UI.ReferenceFacet',
        Label  : 'Request Details',
        Target : '@UI.FieldGroup#Details' }
    ],
    FieldGroup #General : { Data: [
      { Value: requestedBy,  Label: 'Requested By' },
      { Value: requestDate,  Label: 'Request Date' },
      { Value: status,       Label: 'Status' }
    ]},
    FieldGroup #Details : { Data: [
      { Value: vendor.name,  Label: 'Vendor' },
      { Value: product.name, Label: 'Product' },
      { Value: quantity,     Label: 'Quantity' },
      { Value: totalAmount,  Label: 'Total Amount' },
      { Value: notes,        Label: 'Notes' }
    ]}
  }
);

annotate ProcurementService.Vendors with @(
  UI: {
    HeaderInfo: {
      TypeName       : 'Vendor',
      TypeNamePlural : 'Vendors',
      Title          : { Value: name }
    },
    LineItem: [
      { Value: name,     Label: 'Vendor Name' },
      { Value: email,    Label: 'Email' },
      { Value: country,  Label: 'Country' },
      { Value: category, Label: 'Category' },
      { Value: isActive, Label: 'Active' }
    ],
    SelectionFields: [ country, category, isActive ]
  }
);

annotate ProcurementService.Products with @(
  UI: {
    HeaderInfo: {
      TypeName       : 'Product',
      TypeNamePlural : 'Products',
      Title          : { Value: name }
    },
    LineItem: [
      { Value: name,        Label: 'Product Name' },
      { Value: description, Label: 'Description' },
      { Value: price,       Label: 'Price' },
      { Value: unit,        Label: 'Unit' },
      { Value: category,    Label: 'Category' }
    ],
    SelectionFields: [ category ]
  }
);
