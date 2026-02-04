import { bindable } from 'aurelia-framework';
var UomLoader = require('../../../../loader/uom-loader');
var CurrencyLoader = require('../../../../loader/currency-loader');


export default class DisposisiBaruItem {
  @bindable dataUom;
  @bindable dataCurrency;

  activate(context) {
    this.context = context;
    this.data = context.data;
    this.error = this.context.error;
    this.options = (this.context && this.context.context && this.context.context.options) || this.context.options || {};
    this.readOnly = this.options.readOnly || this.data.IsDisabled;
    if (this.data.Uom) {
      this.dataUom = this.data.Uom;
    }

    if (this.data.ProductCurrency) {
      this.dataCurrency = {
        Code: this.data.ProductCurrency
      };
}
  }


  removeItem(data) {
    if (this.options.remove) {
      this.options.remove(data);
    }
  }

  dataUomChanged(newValue) {
    this.data.Uom = newValue.Unit;
    this.data.UomId = newValue.Id;

  }

  dataCurrencyChanged(newValueCurrency) {
    if (!newValueCurrency) return;
    this.data.ProductCurrency = newValueCurrency.Code;
  }
  get uomLoader() {
    return UomLoader;
  }
  get currencyLoader() {
    return CurrencyLoader;
  }
}