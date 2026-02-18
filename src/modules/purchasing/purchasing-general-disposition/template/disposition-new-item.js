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

    this.selectedSupplier = this.defaultSupplier;
    this.isInitialLoad = true;
    this.updateSupplierList();
    this.isInitialLoad = false;
    this.setupObservers();
    
  }

  setupObservers() {
    const propsToObserve = [
      'SupplierName1', 'SupplierPrice1',
      'SupplierName2', 'SupplierPrice2',
      'SupplierName3', 'SupplierPrice3'
    ];

    propsToObserve.forEach(prop => {
      let subscription = this.bindingEngine
        .propertyObserver(this.data, prop)
        .subscribe(() => this.updateSupplierList());
      this.subscriptions.push(subscription);
    });
  }

  updateSupplierList() {
    if (!this.data) {
      this.supplierList = [this.defaultSupplier];
      this.selectedSupplier = this.defaultSupplier;
      this.ShowSupplierDropdown = false;
      return;
    }

    var suppliers = [1, 2, 3]
      .filter(i => this.data[`SupplierName${i}`] && this.data[`SupplierPrice${i}`] && this.data[`SupplierPrice${i}`] !== 0)
      .map(i => ({
        id: i,
        name: this.data[`SupplierName${i}`],
        price: this.data[`SupplierPrice${i}`],
        label: `${this.data[`SupplierName${i}`]} - ${this.data[`SupplierPrice${i}`]}`
      }));

    this.supplierList = [this.defaultSupplier, ...suppliers];

    // Reset ke default setiap ada perubahan (bukan saat initial load), user harus klik ulang
    if (!this.isInitialLoad) {
      this.selectedSupplier = this.defaultSupplier;
      this.data.ProductPrice = 0;
    }

    this.ShowSupplierDropdown = suppliers.length > 0;
  }

  detached() {
    this.subscriptions.forEach(sub => sub.dispose());
    this.subscriptions = [];
  }

  supplierChanged(e) {
    this.SupplierPick = this.selectedSupplier;
    if (this.selectedSupplier) {
      this.data.ProductPrice = this.selectedSupplier.price;
    }
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