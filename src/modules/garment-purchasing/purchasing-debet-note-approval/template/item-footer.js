import { inject, bindable, computedFrom } from 'aurelia-framework';
import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api"

export class DetailFooter {
  activate(context) {
    this.context = context;
    
    // Handle options from parent context
    if (context.context && context.context.options) {
        this.options = context.context.options;
    } else if (context.options) {
        this.options = context.options;
    } else {
        this.options = {};
    }
    
    this.readOnly = this.options.readOnly !== undefined ? this.options.readOnly : true;
  }

  get currency(){
    if (this.options && this.options.CurrencyCode) {
        return this.options.CurrencyCode;
    }
    return this.context.options ? this.context.options.CurrencyCode : '';
  }

  get itemSum() {
    var qty = this.context.items
      .map((item) => item.data.AmountFinal || 0);
    return qty
      .reduce((prev, curr, index) => { return prev + curr }, 0);
  }


}
