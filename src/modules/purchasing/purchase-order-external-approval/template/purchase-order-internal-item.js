import {bindable} from 'aurelia-framework'
var ProductLoader = require('../../../../loader/product-loader');
var UomLoader = require('../../../../loader/uom-loader');

export class PurchaseOrderItem {
  @bindable selectedDealUom
  activate(context) {
    this.context = context;
    this.data = context.data;
    //this.priceBeforeTax=this.data.priceBeforeTax;
    this.error = context.error;
    this.options = context.options;
    this.useVat = this.context.context.options.useVat || false;
    if(!this.useVat){
      this.data.includePpn=false;
    }
  
    if(this.options.readOnly!=true && isNaN(this.data.priceBeforeTax%1))
      this.error.price="Harga Barang Harus Diisi Dengan Angka";
  }
  
 
  updatePrice() {
    if (this.data.includePpn) {
//    this.data.pricePerDealUnit = (100 * parseFloat(this.data.priceBeforeTax)) / 110;
      this.data.pricePerDealUnit = (100 * parseFloat(this.data.priceBeforeTax)) / (100 + parseFloat(this.data.vatTax.rate));       
    } else {
      this.data.pricePerDealUnit = parseFloat(this.data.priceBeforeTax);
    }
  }


  conversionChanged(e) {
    if (this.data.dealUom.unit)
      if (this.data.dealUom.unit == this.data.defaultUom.unit) {
        this.data.conversion = 1;
      }
  }

  
  useIncomeTaxChanged(e) {
    this.updatePrice();
  }

  get productLoader() {
    return ProductLoader;
  }

  get uomLoader() {
    return UomLoader;
  }


  controlOptions = {
    control: {
      length: 12
    }
  };
}