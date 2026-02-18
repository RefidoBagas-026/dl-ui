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

    if (!this.data.product) {
      this.data.product = {
        _id: null,
        code: null,
        name: null,
        price: 0,
        uom: {
          _id: null,
          unit: null
        }
      };
    }

    if (this.data.product && this.data.product.code && this.data.product.name) {
      this.dataProduct = `${this.data.product.code} - ${this.data.product.name}`;
    }

    if (!this.data.currency) {
      this.data.currency = {
        _id: null,
        code: null,
        rate: 0
      };
    }

    if (this.data.currency && this.data.currency.code) {
      this.dataCurrency = this.data.currency;
    }
  }

  removeItem(data) {
    if (this.options.remove) {
      this.options.remove(data);
    }
  }

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
    } else {
      this.data.productId = null;
      this.data.product = {
        _id: null,
        code: null,
        name: null,
        price: 0,
        uom: {
          _id: null,
          unit: null
        }
      };
    }
  }


   dataCurrencyChanged(newValue) {
    if (newValue) {
      this.data.currency = {
        _id: newValue.Id,
        code: newValue.code,
        rate: newValue.rate
      }
    } else {
      this.data.currency = {
        _id: null,
        code: null,
        rate: 0
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