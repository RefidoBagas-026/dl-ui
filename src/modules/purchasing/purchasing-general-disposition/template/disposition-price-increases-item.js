import { bindable, inject } from 'aurelia-framework';
import { BindingEngine } from 'aurelia-binding';
var ProductLoader = require('../../../../loader/product-purchasing-null-tags-loader');
var CurrencyLoader = require('../../../../loader/garment-currencies-by-date-loader');

@inject(BindingEngine)
export default class DisposisiKenaikanHargaItem {
@bindable dataProduct;
  subscriptions = [];
  selectedSupplier = null;
  supplierList = [];
  ShowSupplierDropdown = false;
  defaultSupplier = { id: 0, name: '', price: 0, label: '-- Pilih Harga Supplier --' };
  isInitialLoad = false;

  constructor(bindingEngine) {
    this.bindingEngine = bindingEngine;
  }

  activate(context) {
    this.context = context;
    this.data = context.data;
    this.error = this.context.error;
    this.options = context.context.options.options || {};
    this.readOnly = this.options.readOnly || this.data.IsDisabled;
    if (this.data.ProductName) {
      this.dataProduct = this.data.ProductName;
    }
    // Subscribe to ProductPrice and UpdatePrice changes
    this.subscriptions.push(
      this.bindingEngine.propertyObserver(this.data, 'ProductPrice')
        .subscribe(() => this.calculatePriceDiff())
    );
    this.subscriptions.push(
      this.bindingEngine.propertyObserver(this.data, 'UpdatePrice')
        .subscribe(() => this.calculatePriceDiff())
    );

    this.selectedSupplier = this.defaultSupplier;
    this.isInitialLoad = true;
    this.updateSupplierList();
    this.isInitialLoad = false;
    this.setupObservers();
  }

  detached() {
    // Dispose subscriptions to avoid memory leaks
    this.subscriptions.forEach(sub => sub.dispose());
    this.subscriptions = [];
  }


  calculatePriceDiff() {
    var master = Number(this.data.ProductPrice) || 0;
      var update = Number(this.data.UpdatePrice) || 0;
      var diff = update - master;

      this.data.PriceDifference = diff;

      this.data.Percentage = master !== 0
        ? (diff / master) * 100
        : 0;
  }

    async dataProductChanged(newValue) {
      this.data.product = newValue;
      if (this.data.product) {
      this.data.ProductId = this.data.product.Id;
      this.data.ProductCode = this.data.product.Code;
      this.data.ProductName = this.data.product.Name;
      this.data.ProductPrice = this.data.product.Price;
      this.data.ProductCurrency = this.data.product.Currency.Code;
      this.data.Uom = this.data.product.UOM.Unit;
      this.data.UomId = this.data.product.UOM.Id;

      if(this.data.product.Currency && this.data.product.Currency.Code){
        const currencyCode = this.data.product.Currency.Code;
        await this.currencyLoader(currencyCode).then(currencies => {
          let selectedCurrency = currencies.find(currency => currency.code === currencyCode);
          console.log(selectedCurrency);
          if(selectedCurrency){
            this.data.ProductCurrencyId = selectedCurrency.Id;
            this.data.ProductRate = selectedCurrency.rate;
          }
        });
      }
      delete this.data.product;
    }
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
      this.data.UpdatePrice = 0;
    }

    this.ShowSupplierDropdown = suppliers.length > 0;
  }

 
  supplierChanged(e) {
    this.SupplierPick = this.selectedSupplier;
    if (this.selectedSupplier) {
      this.data.UpdatePrice = this.selectedSupplier.price;
    }
  }
  
     isPostedQuery = {
      "Active": true
    }
    
    get currencyLoader() {
        return CurrencyLoader;
    }
    get productLoader() {
        return ProductLoader;
      }

}