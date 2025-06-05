import { inject, bindable, computedFrom } from 'aurelia-framework'

const UomLoader = require("../../../../../loader/uom-loader");

export class Items {
    @bindable selectedUom;

    get uomLoader() {
        return UomLoader;
    }
    uomView = (uom) => {
        return uom.Unit
    }

    constructor() {
    }

    activate(context) {
        this.context = context;
        this.data = context.data;
        this.error = context.error;
        this.options = context.options;
        if (this.data) {
            this.selectedUom = this.data.Uom;
        }
        this.readOnly = this.options.readOnly;
        this.isCreate = context.context.options.isCreate;
        this.isEdit = context.context.options.isEdit;
        this.itemOptions = {
            error: this.error,
            isCreate: this.isCreate,
            readOnly: this.readOnly,
            isEdit: this.isEdit,
        };
    }

    selectedUomChanged(newValue) {
        this.data.Uom = newValue;
    }

    changeCheckBox() {
        console.log("changeCheckBox", this.context);
        this.context.context.options.checkedAll = this.context.context.items.reduce((acc, curr) => acc && curr.data.IsSave, true);
    }
}