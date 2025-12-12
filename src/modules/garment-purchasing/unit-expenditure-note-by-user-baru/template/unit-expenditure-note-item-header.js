export class UnitExpenditureNoteItemHeader {

  activate(context) {
    this.context = context;
    this.data = context.data;
    this.items = context.items;
    console.log(this.items);
    this.options = context.options;
    console.log(this.options);
    this.readOnly = this.options.readOnly;
    this.isProces=this.options.expenditureType;
  }

  changeCheckedAll() {
      this.items.filter(item => item.data.IsDisabled === false)
          .forEach(item => {
              item.data.IsSave = (this.options.checkedAll === true);
              item.data.Details.forEach(detail => {
                detail.IsSave = (this.options.checkedAll === true);
              });
          });
  }
}