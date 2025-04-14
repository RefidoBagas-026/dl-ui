import { inject, bindable, computedFrom } from 'aurelia-framework'
const UomLoader = require('../../../../../loader/uom-loader');
import { Service } from "../service";

@inject(Service)
export class items {

    constructor(service) {
        this.service = service;
    }

    async activate(context) {
        this.context = context;
        this.data = context.data;
        this.error = context.error;
        this.options = context.options;
        this.readOnly = this.options.readOnly;
        this.isCreate = context.context.options.isCreate;
        this.isEdit = context.context.options.isEdit;
        
        if (this.data.product) {
            this.productView = this.data.product.code + ' - ' + this.data.product.name;
        }
    }

    get uomLoader() {
        return UomLoader;
    }

    uomView = (data) => {
        return `${data.Unit || data.unit}`;
    }
}