import { bindable, computedFrom } from 'aurelia-framework'
var InternalNoteLoader = require('../../../loader/garment-intern-note-loader');

export class DataForm {
    @bindable error = {};
    @bindable title;
    @bindable internalNote;
    @bindable data = {};

    controlOptions = {
        label: {
            length: 4
        },
        control: {
            length: 5
        }
    }

    itemsInfo = {
        columns: [
            { header: "No. Nota Intern" },
            { header: "Tgl. Nota Intern" },
            { header: "Mata Uang" },
            { header: "Supplier" },
            { header: "Nomor Invoice" },
            { header: "Tanggal Invoice" },
            { header: "Total Amount" },
            { header: "Keterangan" },
            { header: "Admin Pembelian" }
        ]
    };

    scanResultsInfo = {
        columns: [
            { header: "Nomor PO Eksternal" }
        ], onAdd: function () {
            this.data.PurchaseOrder.push({});
        }.bind(this)
    };

    bind(context) {
        this.context = context;
        this.data = this.context.data;
        this.error = this.context.error;
    }

    get internalNoteLoader() {
        return InternalNoteLoader;
    }

    @computedFrom("internalNote")
    get selectedInternalNote() {
        return this.internalNote && [this.internalNote];
    }

    onFileChange(event) {
        const files = event.target.files;
        if (files && files[0]) {
            const file = files[0];
            if (file.type !== 'application/pdf') {
                this.error.uploadError = 'File harus bertipe PDF';
                alert('File harus bertipe PDF');
                return;
            }
            this.error.uploadError = null;
        }
    }

    clearScanData() {
        this.error.uploadError = null;
        var currentData = this.data;
        currentData.purchaseOrderFile = null;
        currentData.PurchaseOrder.splice(0, currentData.PurchaseOrder.length);
        this.data = currentData;
    }
}