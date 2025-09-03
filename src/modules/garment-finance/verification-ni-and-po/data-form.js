import { bindable, computedFrom } from 'aurelia-framework'
var InternalNoteLoader = require('../../../loader/garment-intern-note-loader');

export class DataForm {
    @bindable error = {};
    @bindable title;
    @bindable internalNote;

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

    bind(context) {
        this.context = context;
        this.error = this.context.error;
    }

    get internalNoteLoader() {
        return InternalNoteLoader;
    }

    @computedFrom("internalNote")
    get selectedInternalNote() {
        return this.internalNote && [this.internalNote];
    }
}