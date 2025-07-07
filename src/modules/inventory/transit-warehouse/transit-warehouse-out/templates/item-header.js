export class ItemHeader {

  activate(context) {
    this.context = context;
    this.data = context.data;
    this.Items = context.items;
    this.options = context.options;
    this.readOnly = this.options.readOnly;
  }

  changeCheckedAll() {
    this.Items.filter(item => item.data.IsDisabled === false)
      .forEach(item => {
        item.data.IsSave = (this.options.checkedAll === true);
      });
  }
}