import { inject, useView } from 'aurelia-framework';
import { DialogController } from 'aurelia-dialog';

@inject(DialogController)
@useView("./po-scan-result-dialog.html")
export class POScanResultDialog {
    constructor(controller) {
        this.controller = controller;
    }

    scanResultItem = {
        columns: [
            { header: "Nomor Refpr" },
            { header: "Jumlah" },
            { header: "Harga Satuan" },
        ],
        onAdd: function () {
            this.editData.Items.push({});
        }.bind(this)
    };

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
        // Deep clone the data to avoid mutating the original until saved
        this.originalData = purchaseOrderScannedResult;
        this.editData = JSON.parse(JSON.stringify(purchaseOrderScannedResult));
        // Optionally, clone error object if needed
        this.error = {};
    }

    save() {
        // Copy changes from editData back to originalData
        for (const key in this.editData) {
            if (Object.prototype.hasOwnProperty.call(this.editData, key)) {
                this.originalData[key] = this.editData[key];
            }
        }
        // Return the updated original data to the caller
        this.controller.ok(this.originalData);
    }

    cancel() {
        this.controller.cancel();
    }
}