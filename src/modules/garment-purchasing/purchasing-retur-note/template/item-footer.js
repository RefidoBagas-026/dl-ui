import { inject, bindable, computedFrom } from 'aurelia-framework';
import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api"

export class DetailFooter {
  activate(context) {
    this.context = context;
  }

  get currency(){
    return this.context.options.CurrencyCode;

  }

  get itemSum() {
    var qty = this.context.items
      .map((item) => item.data.TotalPrice || 0);
    return qty
      .reduce((prev, curr, index) => { return prev + curr }, 0);
  }

  get rate() {
    return this.context.options.Rate || 1;
  }

  get otherTaxBaseAmount() {
    if (this.context.options.OtherTaxBaseAmount !== undefined && this.context.options.OtherTaxBaseAmount !== null) {
      return this.context.options.OtherTaxBaseAmount;
    }
   
    if (this.currency === 'IDR') {
      return (11/12) * this.itemSum;
    } else {
      return (11/12) * (this.rate * this.itemSum);
    }
  }

  get vatToBeRefunded() {
  
    if (this.context.options.VatToBeRefunded !== undefined && this.context.options.VatToBeRefunded !== null) {
      return this.context.options.VatToBeRefunded;
    }

    return this.otherTaxBaseAmount * 0.12;
  }


}
