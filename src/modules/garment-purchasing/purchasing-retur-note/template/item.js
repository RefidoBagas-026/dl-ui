import { bindable, computedFrom, BindingSignaler, inject } from 'aurelia-framework';
var UomLoader = require('../../../../loader/uom-loader');

export class Item {
   @bindable dataUom;

  constructor() {
  }

  activate(context) {
    this.data = context.data;
    this.error = context.error;
    this.options = context.context.options;
    this.readOnly = context.options.readOnly;

    this.selectedPricePerUnit = this.data.PricePerUnit || 0;
    this.selectedQuantity = this.data.Quantity || 0;

     if (this.data.Uom) {
      this.dataUom = this.data.Uom;
    }

    this.calculateTotalPrice();
  }

  calculateTotalPrice() {
    const quantity = this.data.Quantity || 0;
    const pricePerUnit = this.data.PricePerUnit || 0;
    this.data.TotalPrice = Math.round((quantity * pricePerUnit + Number.EPSILON) * 100) / 100;
    
    if (this.options.updateTotalPrice) {
      this.options.updateTotalPrice();
    }
  }

  @bindable selectedPricePerUnit;
  selectedPricePerUnitChanged(newValue) {
    this.data.PricePerUnit = Number(newValue != null ? newValue : 0);
    this.calculateTotalPrice();
  }
  // selectedPricePerUnitChanged(newValue, oldValue) {
  //   if (newValue) {
  //     this.data.PricePerUnit = newValue;
  //     this.calculateTotalPrice();
  //   }
  // }

  @bindable selectedQuantity;
 selectedQuantityChanged(newValue) {
    this.data.Quantity = Number(newValue != null ? newValue : 0);
    this.calculateTotalPrice();
  }
  // selectedQuantityChanged(newValue, oldValue) {
  //   if (newValue) {
  //     this.data.Quantity = newValue;
  //     this.calculateTotalPrice();
  //   }
  // }

  dataUomChanged(newValue) {
    this.data.Uom = newValue.Unit;
    this.data.UomId = newValue.Id;

  }

  get uomLoader() {
      return UomLoader;
    }

}
