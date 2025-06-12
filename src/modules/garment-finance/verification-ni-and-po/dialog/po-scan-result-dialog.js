import { inject, useView } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

@inject(DialogController)
@useView("./po-scan-result-dialog.html")
export class POScanResultDialog {
    constructor(controller) {
        this.controller = controller;
    }

    columns = [
        { field: "PO_SerialNumber", title: "Nomor Refpr" },
        { field: "DealQuantity", title: "Jumlah" },
        { field: "PricePerDealUnit", title: "Harga Satuan" },
    ];

    controlOptions = {
        label: {
            length: 4,
        },
        control: {
            length: 4,
        },
    };

    options = {
        search: false,
        pagination: false,
        showColumns: false,
        showToggle: false,
        clickToSelect: false,
        height: 300
    }

    async activate(purchaseOrderScannedResult) {
        this.data = purchaseOrderScannedResult;
    }
}