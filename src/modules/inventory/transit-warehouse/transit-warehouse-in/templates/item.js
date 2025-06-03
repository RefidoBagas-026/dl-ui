import { inject, bindable, computedFrom } from 'aurelia-framework'

const UomLoader = require("../../../../../loader/uom-loader");

export class Items {
    get uomLoader() {
        return UomLoader;
    }

    constructor() {

    }

    activate(context) {
        this.context = context;
        this.data = context.data;
        this.error = context.error;
        console.log(this.context);
        this.options = context.options;
        if (this.data) {
            this.selectedUom = this.data.Uom;
        }
        this.readOnly = this.options.readOnly;
        this.isCreate = context.context.options.isCreate;
        this.isEdit = context.context.options.isEdit;

    }

    get ProductName() {
        return (this.data.ProductName || "").toUpperCase();
    }
    set ProductName(value) {
        this.data.ProductName = value.toUpperCase();
    }

}