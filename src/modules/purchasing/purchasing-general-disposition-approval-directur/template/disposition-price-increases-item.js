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