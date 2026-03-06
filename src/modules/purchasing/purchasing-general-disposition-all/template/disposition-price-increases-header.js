import { inject } from 'aurelia-framework';

@inject(Element)
export default class DisposisiKenaikanHargaHeader {

  constructor(element) {
    this.element = element;
  }

  activate(context) {
    this.context = context;
    this.data = context.data;
    this.items = context.items;
    this.options = context.options;
    this.readOnly = this.options.readOnly;
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