import { bindable, computedFrom, BindingSignaler, inject } from 'aurelia-framework';
var IncomeTaxLoader = require('../../../../loader/income-tax-loader');
var VatTaxLoader = require('../../../../loader/vat-tax-loader');

// @inject(BindingSignaler)
export class Item {

  controlOptions = {
    label: {
      align: "right",
      length: 5,
    },
    control: {
      length: 5,
      align: "right",
    },
  };

  constructor() {
  }

  activate(context) {
    this.data = context.data;
    this.error = context.error;
    
    // Handle options from parent context
    if (context.context && context.context.options) {
        this.options = context.context.options;
    } else if (context.options) {
        this.options = context.options;
    } else {
        this.options = {};
    }
    
    this.readOnly = this.options.readOnly !== undefined ? this.options.readOnly : true;

    // this.selectedIncomeTax = this.data.IncomeTax || null;
    this.selectedIncomeTaxBy = this.data.IncomeTaxBy || "";
    this.selectedAmount = this.data.Amount || 0;
    this.selectedPPh = this.data.IsGetPph;
    this.selectedVat = this.data.IsGetPpn;


    if (this.data.IncomeTax) {
      this.selectedIncomeTax = this.data.IncomeTax;
      this.selectedIncomeTax.name = this.data.IncomeTax.Name;
      this.selectedIncomeTax.rate = this.data.IncomeTax.Rate ? this.data.IncomeTax.Rate : 0;
      this.data.IncomeTax.rate = this.data.IncomeTax.Rate ? this.data.IncomeTax.Rate : 0;
    }

    if (this.data.VatTax) {
      this.selectedVatTax = this.data.VatTax;
      this.selectedVatTax.Rate = this.data.VatTax.Rate ? this.data.VatTax.Rate :"";
      this.data.VatTax.Rate = this.data.VatTax.Rate ? this.data.VatTax.Rate : "";
    }
   

    this.calculateTotalAmount();
  }

  IncomeTaxByOptions = ["", "Supplier", "Dan Liris"];

  get incomeTaxLoader() {
    return IncomeTaxLoader;
  }

  incomeTaxView = (incomeTax) => {

    return incomeTax.name ? `${incomeTax.name} - ${incomeTax.rate}` : "";

  }

  vatTaxView = (vatTax) => {
    return vatTax.rate ? `${vatTax.rate}` : `${vatTax.Rate}`;
  }

  get vatTaxLoader() {
    return VatTaxLoader;
}

  @bindable selectedIncomeTaxBy;
  selectedIncomeTaxByChanged(newValue) {
    if (newValue) {
      this.data.IncomeTaxBy = newValue
      this.calculateTotalAmount();
    }
    else {
      delete this.data.IncomeTaxBy;
      this.calculateTotalAmount();
    }
  }

  @bindable selectedVat;
  selectedVatChanged(newValue) {
    if (newValue) {
      this.data.IsGetPpn = newValue
      this.calculateTotalAmount();
    } else {
      this.selectedVatTax = null;
      delete this.data.IsGetPpn;
      this.calculateTotalAmount();
    }
  }

  @bindable selectedPPh;
  selectedPPhChanged(newValue) {
    if (newValue) {
      this.data.IsGetPph = newValue;
      this.calculateTotalAmount();
    } else {
      this.selectedIncomeTax = null;
      this.selectedIncomeTaxBy = "";
      delete this.data.IsGetPph;
      this.calculateTotalAmount();
    }
  }


  calculateTotalAmount() {
    let incomeTaxRate = this.data.IncomeTax ? this.data.IncomeTax.rate : 0;
    if (this.data.IncomeTaxBy == "Supplier" && this.data.IsGetPph && this.data.IncomeTax) {
      let vatAmount = 0;
      if (this.data.IsGetPpn && this.data.VatTax)
        vatAmount = this.data.VatTax.Rate == 12 ? this.data.Amount *11/12 * (this.data.VatTax.Rate / 100): this.data.Amount * (this.data.VatTax.Rate / 100);
      let pphAmount = this.data.Amount * (incomeTaxRate / 100);
      this.data.AmountPPH = pphAmount;
      this.data.AmountPPN = vatAmount;
      this.data.AmountFinal = Math.round((this.data.Amount - pphAmount + vatAmount + Number.EPSILON) * 100) / 100;
    } else {
      let vatAmount = 0;
      if (this.data.IsGetPpn && this.data.VatTax)
        //vatAmount = this.data.Amount * (this.data.VatTax.Rate / 100);
        vatAmount = this.data.VatTax.Rate == 12 ? this.data.Amount *11/12 * (this.data.VatTax.Rate / 100): this.data.Amount * (this.data.VatTax.Rate / 100);
      let pphAmount = this.data.Amount * (incomeTaxRate / 100);
      this.data.AmountPPH = pphAmount;
      this.data.AmountPPN = vatAmount;
      this.data.AmountFinal = Math.round((this.data.Amount + vatAmount + Number.EPSILON) * 100) / 100;
      
    }
    if (this.options.updateTotalAmount) {
      this.options.updateTotalAmount();
    }
  }



  @bindable selectedIncomeTax;
  selectedIncomeTaxChanged(newValue, oldValue) {
    if (newValue) {
      this.data.IncomeTax = newValue;
      this.data.IncomeTax.Rate = this.data.IncomeTax.rate;
      this.data.IncomeTax.Name = this.data.IncomeTax.name;
      this.calculateTotalAmount();

    } else {
      this.data.IncomeTax = {};
      this.data.IncomeTax.Rate = 0;
      this.data.IncomeTax.Name = "";
      this.calculateTotalAmount();
    }
  }

  @bindable selectedVatTax;
  selectedVatTaxChanged(newValue, oldValue) {
    if (newValue) {
      this.data.VatTax = newValue;
      this.data.VatTax.Rate = this.data.VatTax.Rate;
      this.calculateTotalAmount();
    }else{
      this.data.VatTax = {};
      this.data.VatTax.Rate = "";
      this.calculateTotalAmount();
  }
}

  @bindable selectedAmount;
  selectedAmountChanged(newValue, oldValue) {
    if (newValue) {
      this.data.Amount = newValue;
      this.calculateTotalAmount();
    }
  }
}
