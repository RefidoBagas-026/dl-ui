import { bindable, customElement } from 'aurelia-framework';
import { inject } from 'aurelia-dependency-injection';
import moment from 'moment';

@customElement('au-comparison-editable')
@inject(Element)
export class ComparisonEditable {
  @bindable label = '';
  @bindable value1 = '';
  @bindable value2 = '';
  @bindable label1 = 'Data 1';
  @bindable label2 = 'Data 2';
  @bindable format = '';
  @bindable options = {};
  @bindable readOnly1 = false;
  @bindable readOnly2 = false;
  @bindable highlightDifferences = true;
  @bindable placeholder1 = '';
  @bindable placeholder2 = '';

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
    return String(this.value1 || '').trim() !== String(this.value2 || '').trim();
  }

  get controlOptions() {
    return this.options || {};
  }

  value1Changed(newValue, oldValue) {
    this.dispatchChangeEvent('value1', newValue, oldValue);
  }

  value2Changed(newValue, oldValue) {
    this.dispatchChangeEvent('value2', newValue, oldValue);
  }

  dispatchChangeEvent(field, newValue, oldValue) {
    const changeEvent = new CustomEvent('comparison-change', {
      detail: {
        field: field,
        newValue: newValue,
        oldValue: oldValue,
        label: this.label,
        isDifferent: this.isDifferent
      },
      bubbles: true
    });
    this.element.dispatchEvent(changeEvent);
  }
}
