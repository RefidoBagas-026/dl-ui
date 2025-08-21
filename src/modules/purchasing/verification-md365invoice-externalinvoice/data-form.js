import { bindable, computedFrom, inject } from 'aurelia-framework'
import { PLATFORM } from 'aurelia-pal';
import { Service } from './service';

var D365InvoiceLoader = require('../../../loader/d365-invoice-loader');

@inject(Service)
export class DataForm {
    @bindable readOnly = true;
    @bindable data = {};
    @bindable error = {};
    @bindable title;
    @bindable options = { readOnly: true };
    @bindable d365Invoice;

    controlOptions = {
        label: {
            length: 4
        },
        control: {
            length: 5
        }
    }

    constructor(service) {
        this.service = service;
    // compose VM for sections
    this.uploadVm = PLATFORM.moduleName('./upload/upload');
    this.scanResultVm = PLATFORM.moduleName('./upload/scan-result');
    this.scanResultDataVm = PLATFORM.moduleName('./upload/scan-result-data');
    }

    itemsInfoReadOnly = {
        columnsReadOnly: [
            { header: "Nomor Purchase Order" }
        ]
    }

    bind(context) {
        this.context = context;
        this.data = this.context.data;
        this.error = this.context.error;
        this.options.readOnly = this.readOnly;
    this.scanResult = null; // hasil upload
    }

    get d365InvoiceLoader() {
        return D365InvoiceLoader;
    }

    d365InvoiceView = (d365Invoice) => {
        if (!d365Invoice) return '';
        const no = d365Invoice.InvoiceNo || '';
        const pos = d365Invoice.purchaseOrders || '';
        if (!no && !pos) return '';
        return pos ? `${no || ''} - ${pos}` : `${no}`;
    }

    @computedFrom("d365Invoice")
    get d365InvoiceIsSelected() {
        return !!(this.d365Invoice && (this.d365Invoice.InvoiceId || this.d365Invoice.InvoiceNo));
    }

    // Upload handlers are implemented in upload/upload.js
    handleUploadResult = (result) => {
        this.scanResult = result;
    }
}