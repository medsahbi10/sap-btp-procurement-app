sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"procurement/app/procurementui/test/integration/pages/PurchaseRequestsList",
	"procurement/app/procurementui/test/integration/pages/PurchaseRequestsObjectPage"
], function (JourneyRunner, PurchaseRequestsList, PurchaseRequestsObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('procurement/app/procurementui') + '/test/flp.html#app-preview',
        pages: {
			onThePurchaseRequestsList: PurchaseRequestsList,
			onThePurchaseRequestsObjectPage: PurchaseRequestsObjectPage
        },
        async: true
    });

    return runner;
});

