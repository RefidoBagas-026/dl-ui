import { inject, bindable, computedFrom } from 'aurelia-framework';
import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api"

export class DetailFooter {
  activate(context) {
    this.context = context;
  }

  get currency(){
    return this.context.options.CurrencyCode || '';
  }

  get bkpReturnPrice() {
    return this.context.options.BKPReturnPrice || 0;
  }

  get otherTaxBaseAmount() {
    return this.context.options.OtherTaxBaseAmount || 0;
  }

  get vatToBeRefunded() {
    return this.context.options.VatToBeRefunded || 0;
  }
}
