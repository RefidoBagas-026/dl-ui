import { bindable, computedFrom } from 'aurelia-framework'
import { factories } from 'powerbi-client';
import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api";

var UomLoader = require('../../../../loader/uom-loader');
export class UnitDeliveryOrderCCItem {
     @bindable uomUnit;
    async activate(context) {
    this.context = context;
    this.data = context.data;
    this.error = context.error;
    this.options = context.options;
    
    this.readOnly = this.options.readOnly || this.data.IsDisabled;
    this.isEdit = context.context.options.isEdit;
    this.uomUnit = {
        Id:this.data.UomId || 0,
        Unit: this.data.UomUnit || ""
    }

    console.log(this.uomUnit);
    }
    bind(){

    }
    uomUnitChanged(newValue) {
        if (newValue && newValue.Id) {
            this.data.UomId = newValue.Id;
            this.data.UomUnit = newValue.Unit;
        } else {
            this.data.UomId = null;
            this.data.UomUnit = null;
        }
    }

    changeCheckBox() {
        this.context.context.options.checkedAll = this.context.context.items.filter(item => item.data.IsDisabled === false).reduce((acc, curr) => acc && curr.data.IsSave, true);
    }
    get uomLoader(){
        return UomLoader;
    }

    uomView = (uom) => {
        return uom.Unit
    }
}