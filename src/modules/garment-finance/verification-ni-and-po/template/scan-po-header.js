import { inject, containerless, bindable } from 'aurelia-framework'
import { Service } from '../service';
var ExternalPurchaseOrderLoader = require('../../../../loader/garment-purchase-order-external-loader');

@containerless()
@inject(Service)
export class ScanPOHeader {

    @bindable purchaseOrder;

    itemsInfo = {
        columns: [
            { header: "Nomor Ref PR" },
            { header: "Jumlah" },
            { header: "Harga Satuan" }
        ]
    };

    controlOptions = {
        control: {
            length: 12
        }
    };

    constructor(service) {
        this.service = service;
    }

    async activate(context) {
        this.context = context;
        this.isShowing = false;
        this.data = context.data;
        if (this.data.EPONo) {
            this.purchaseOrder = this.data;
        }
        this.error = context.error;
    }

    get externalPurchaseOrderLoader() {
        return ExternalPurchaseOrderLoader;
    }

    async purchaseOrderChanged(newValue, oldValue) {
        if (newValue) {
            var purchaseOrderById = await this.service.getExternalPurchaseOrderById(newValue.Id);
            this.data.EPONo = newValue.EPONo;
            this.data.Items = purchaseOrderById.Items;
        }
    }

    toggle() {
        if (!this.isShowing)
            this.isShowing = true;
        else
            this.isShowing = !this.isShowing;
    }

    externalPurchaseOrderView = (externalPurchaseOrder) => {
        return `${externalPurchaseOrder.EPONo}`
    }
}