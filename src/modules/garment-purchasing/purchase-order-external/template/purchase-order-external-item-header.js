export class PurchaseOrderItemHeader {

  activate(context) {
    this.context = context;
    this.data = context.data;
    this.items = context.items;
    this.error = context.error;
    this.options = context.options;
    this.readOnly = (this.options.readOnly === 'true')
    this.isUseIncomeTax = this.options.isUseIncomeTax || false;
  }

  controlOptions = {
    control: {
      length: 12
    }
  };

  changeCheckedAll() {
    this.items
      .forEach(item => {
        item.data.IsArrived = (this.options.checkedAll === true);
      });
  }
}