import { inject } from 'aurelia-framework';

@inject(Element)
export default class DisposisiBaruHeader {

  constructor(element) {
    this.element = element;
  }

  activate(context) {
    this.context = context;
    console.log(this.context);
    this.data = context.data;
    this.items = context.items;
    this.options = context.options.options || {};
    console.log(this.options);
    this.readOnly = this.options.readOnly;
  }
}