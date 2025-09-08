import { bindable, customElement } from 'aurelia-framework';
import { inject } from 'aurelia-dependency-injection';
import moment from 'moment';

@customElement('au-comparison')
@inject(Element)
export class Comparison {
  @bindable label = '';
  @bindable value1 = '';
  @bindable value2 = '';
  @bindable label1 = 'Data 1';
  @bindable label2 = 'Data 2';
  @bindable format = '';
  @bindable options = {};
  @bindable readOnly = true;
  @bindable highlightDifferences = true;

  constructor(element) {
    this.element = element;
  }

  get formattedValue1() {
    return this.formatValue(this.value1);
  }

  get formattedValue2() {
    return this.formatValue(this.value2);
  }

  formatValue(value) {
    if (!value) return '';
    
    if (this.format) {
      // Handle numeric formatting
      if (this.format.includes('.')) {
        const num = parseFloat(value);
        if (!isNaN(num)) {
          const decimalPlaces = this.format.split('.')[1].length;
          return num.toFixed(decimalPlaces);
        }
      }
      
      // Handle date formatting (same as au-datepicker)
      if (this.format === 'date') {
        if (value) {
          return moment(value).format("DD-MMM-YYYY");
        } else {
          return "";
        }
      }
    }
    
    return value;
  }

  get isDifferent() {
    if (!this.highlightDifferences) return false;
    return this.formattedValue1 !== this.formattedValue2;
  }

  get controlOptions() {
    return this.options || {};
  }
}
