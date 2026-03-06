import { bindable, BindingEngine, inject } from 'aurelia-framework';
var UomLoader = require('../../../../loader/uom-loader');
//var CurrencyLoader = require('../../../../loader/currency-loader');
var CurrencyLoader = require('../../../../loader/garment-currencies-by-date-loader');

@inject(BindingEngine)
export default class DisposisiBaruItem {
  @bindable dataUom;
  @bindable dataCurrency;
  selectedSupplier = null;
  supplierList = [];
  ShowSupplierDropdown = false;
  defaultSupplier = { id: 0, name: '', price: 0, label: '-- Pilih Harga Supplier --' };
  isInitialLoad = false;

  constructor(bindingEngine) {
    this.bindingEngine = bindingEngine;
    this.subscriptions = [];
  }

  controlOptions = {
    label: {
      length: 2,
    },
    control: {
      length: 4,
    },
  };

  activate(context) {
    this.context = context;
    this.data = context.data;
    this.error = this.context.error;
    //this.options = (this.context && this.context.context && this.context.context.options) || this.context.options || {};
    this.options = context.context.options.options || {};
    this.readOnly = this.options.readOnly || this.data.IsDisabled;
    if (this.data.Uom) {
      this.dataUom = this.data.Uom;
    }

    if (this.data.ProductCurrency) {
      this.dataCurrency = {
        Id: this.data.ProductCurrencyId,
        rate: this.data.ProductRate,
        code: this.data.ProductCurrency
      };
    }
    if(this.options.difftype){
      this.options.difftype = false;
      this.error = {};
    }

   
  }

  
  detached() {
    this.subscriptions.forEach(sub => sub.dispose());
    this.subscriptions = [];
  }

  

  dataUomChanged(newValue) {
    this.data.Uom = newValue.Unit;
    this.data.UomId = newValue.Id;

  }

  dataCurrencyChanged(newValueCurrency) {
    console.log(newValueCurrency);
    if (!newValueCurrency) return;
    this.data.ProductCurrency = newValueCurrency.code;
    this.data.ProductCurrencyId = newValueCurrency.Id;
    this.data.ProductRate = newValueCurrency.rate;
  }
  get uomLoader() {
    return UomLoader;
  }
  get currencyLoader() {
    return CurrencyLoader;
  }
}