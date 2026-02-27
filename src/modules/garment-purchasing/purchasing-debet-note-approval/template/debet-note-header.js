import { inject } from 'aurelia-framework';

@inject(Element)
export default class DebetNoteHeader {

  constructor(element) {
    this.element = element;
  }

  activate(context) {
    this.context = context;
    this.data = context.data;
    this.items = context.items;
    
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

  addItem() {
    if (
      this.context &&
      this.context.options &&
      typeof this.context.options.add === 'function'
    ) {
      this.context.options.add();
    }
  }
}
