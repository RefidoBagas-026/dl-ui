import { bindable } from 'aurelia-framework';
var ProductLoader = require('../../../../loader/product-purchasing-null-tags-loader');

export default class DisposisiKenaikanHargaItem {
@bindable dataProduct;

  activate(context) {
    this.context = context;
    this.data = context.data;
    this.error = this.context.error;
    this.options = (this.context && this.context.context && this.context.context.options) || this.context.options || {};
    this.readOnly = this.options.readOnly || this.data.IsDisabled;
    if (this.data.ProductName) {
      this.dataProduct = this.data.ProductName;
    }
  }


  removeItem(data) {
    if (this.options.remove) {
      this.options.remove(data);
    }
  }

    dataProductChanged(newValue) {
      this.data.product = newValue;
      if (this.data.product) {
      this.data.ProductId = this.data.product.Id;
      this.data.ProductCode = this.data.product.Code;
      this.data.ProductName = this.data.product.Name;
      this.data.ProductPrice = this.data.product.Price;
      this.data.ProductCurrency = this.data.product.Currency.Code;
      this.data.Uom = this.data.product.UOM.Unit;
      this.data.UomId = this.data.product.UOM.Id;
      delete this.data.product;
    }
    }
  
     isPostedQuery = {
      "Active": true
    }
    
    get productLoader() {
        return ProductLoader;
      }

}