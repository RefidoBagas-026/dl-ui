import { bindable } from 'aurelia-framework';
var ProductLoader = require('../../../../loader/product-purchasing-null-tags-loader');
var CurrencyLoader = require('../../../../loader/garment-currencies-by-date-loader');


export default class DisposisiPembelianItem {
@bindable dataProduct;
@bindable dataCurrency;

  activate(context) {
    this.context = context;
    this.data = context.data;
    this.error = this.context.error;
    this.options = (this.context && this.context.context && this.context.context.options) || this.context.options || {};
    this.readOnly = this.options.readOnly || this.data.IsDisabled;

    if (this.data.product) {
      this.dataProduct = `${this.data.product.code} - ${this.data.product.name}`;
    }
    if (this.data.currency) {
      this.dataCurrency = this.data.currency;
    }
  }

  removeItem(data) {
    if (this.options.remove) {
      this.options.remove(data);
    }
  }

  // dataProductChanged(newValue) {
  //   this.data.product = newValue;
  //   if (this.data.product) {
  //     this.data.ProductId = this.data.product.Id;
  //     this.data.ProductCode = this.data.product.Code;
  //     this.data.ProductName = this.data.product.Name;
  //     this.data.ProductPrice = this.data.product.Price;
  //     this.data.ProductCurrency = this.data.product.Currency.Code;
  //     this.data.Uom = this.data.product.UOM.Unit;
  //     this.data.UomId = this.data.product.UOM.Id;
  //     delete this.data.product;
  //   }

  // }

  dataProductChanged(newValue) {
    if (newValue) {
      this.data.productId = newValue.Id;
      this.data.product = {
        _id: newValue.Id,
        code: newValue.Code,
        name: newValue.Name,
        price: newValue.Price,
        uom: {
          _id: newValue.UOM.Id,
          unit: newValue.UOM.Unit
        }
      };
    }
  }


   dataCurrencyChanged(newValue) {
    this.data.currency = newValue;
    if (this.data.currency) {
      this.data.currency = {
        _id: this.data.currency.Id,
        code: this.data.currency.code,
        rate: this.data.currency.rate
      }
    }
  }

   isPostedQuery = {
    "Active": true
  }
  
  get productLoader() {
      return ProductLoader;
    }

  get currencyLoader() {
    return CurrencyLoader;
  }

}