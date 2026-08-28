import { bindable, inject, BindingEngine } from 'aurelia-framework';
@inject(BindingEngine)
export class ROGarmentMaterial {
    @bindable isMaterialUsed;
    controlOptions = {
        control: {
            length: 12
        }
    };

    async activate(context) {
        this.context = context;
        this.data = this.context.data;
        this.options = this.context.options;
        this.readOnly = this.options.readOnly;
        this.disabled = true;
        this.subCategory = this.data.Category && this.data.Category.SubCategory ? this.data.Category.SubCategory : "";
        this.quantity = this.data.Quantity !== undefined || this.data.Quantity !== null ? parseFloat(Number(this.data.Quantity).toFixed(2)) : 0;
        this.uom = this.data.UOMQuantity && this.data.UOMQuantity.Unit ? this.data.UOMQuantity.Unit : "";
        this.quantityText = this.quantity + " " + this.uom;
        if(!this.data.IsMaterialCancelled){
            this.isMaterialUsed = true;
        } else {
            this.isMaterialUsed = false;
        }
    }

    isMaterialUsedChanged(newValue, oldValue) {
        this.data.IsMaterialCancelled = !newValue;
        if(this.data.IsMaterialCancelled){
            this.data.QuantityUsageRO = 0;
        }
    }
}
