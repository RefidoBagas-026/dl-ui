import { bindable, computedFrom } from 'aurelia-framework'

export class UnitExpenditureNoteItemProses {


  async activate(context) {
    this.context = context;
    this.data = context.data;
    this.error = this.context.error;
    this.options = this.context.options;
    this.ExpenditureType = this.context.context.options.ExpenditureType;
    this.readOnly = this.options.readOnly || this.data.IsDisabled;
    this.data.IsSave = !!this.data.IsSave;

    if (Array.isArray(this.data.Details)) {
      this.data.Details.forEach(d => d.IsSave = !!d.IsSave);
    }

    this.isShowing = false;
    
    if (this.error && this.error.DetailsCount) {
      this.isShowing = true;
    }
 
    if (this.error && Array.isArray(this.error.Details)) {
      const hasDetailError = this.error.Details.some(detail => 
        detail && Object.keys(detail).length > 0
      );
      if (hasDetailError) {
        this.isShowing = true;
      }
    }
  }

  @computedFrom("data.Id")
    get isEdit() {
    if (Array.isArray(this.data.Details) && this.data.Details.length > 0) {
        return !!this.data.Details[0].Id;
    }

    return !!this.data.Id;
    }
 
  changeCheckBox() {
    const ctx = this.context.context;
  if (!ctx || !Array.isArray(ctx.items)) return;

  ctx.options.checkedAll = ctx.items.reduce(
    (acc, curr) => acc && curr.data.IsSave,
    true
  );

  ctx.items.forEach(item => {
    const isSave = !!item.data.IsSave;

    if (Array.isArray(item.data.Details)) {
      item.data.Details.forEach(detail => {
        detail.IsSave = isSave; 
      });
    }
  });
  }
   toggle() {

    if (!this.isShowing)
      this.isShowing = true;
    else
      this.isShowing = !this.isShowing;
  }

  get addDetails() {

    return (event) => {
     
    if (event) event.preventDefault();
    if (!Array.isArray(this.data.Details)) {
      this.data.Details = [];
    }
      const i = this.context.context.items.indexOf(this.context);
      const item = this.data;
      let lastIndex;
      let lastDetail;
      if (this.data.length > 0) {
        lastDetail = this.data[this.data.length - 1];
        lastIndex = this.data[this.data.length - 1].index;
      } else if (i > 0) {
        const lastItem = this.context.context.items[i - 1];
        lastDetail = lastItem.data[lastItem.data.length - 1];
      }
      const nextIndex =
      this.data.Details.length > 0
        ? Math.max(...this.data.Details.map(d => d.index || 0)) + 1
        : 1;

      this.data.Details.push({
            UnitDOItemId: lastDetail ? lastDetail.UnitDOItemId : item.UnitDOItemId,
            URNItemId: lastDetail ? lastDetail.URNItemId : item.URNItemId,
            DODetailId: lastDetail ? lastDetail.DODetailId : item.DODetailId,
            POItemId: lastDetail ? lastDetail.POItemId : item.POItemId,
            EPOItemId: lastDetail ? lastDetail.EPOItemId : item.EPOItemId,
            PRItemId: lastDetail ? lastDetail.PRItemId : item.PRItemId,
            RONo: lastDetail ? lastDetail.RONo : item.RONo,
            RONOItem: lastDetail ? lastDetail.RONOItem : item.RONo,
            ProductId: lastDetail ? lastDetail.ProductId : item.ProductId,
            ProductCode: lastDetail ? lastDetail.ProductCode : item.ProductCode,
            ProductName: lastDetail ? lastDetail.ProductName : item.ProductName,
            ProductRemark: lastDetail ? lastDetail.ProductRemark : item.ProductRemark,
            UomId: lastDetail ? lastDetail.UomId : item.UomId,
            UomUnit: lastDetail ? lastDetail.UomUnit : item.UomUnit,
            PricePerDealUnit: lastDetail ? lastDetail.PricePerDealUnit : item.PricePerDealUnit,
            OldQuantity: lastDetail ? lastDetail.OldQuantity : item.Quantity,
            BuyerId: lastDetail ? lastDetail.BuyerId : item.BuyerId || 0,
            BuyerCode: lastDetail ? lastDetail.BuyerCode : item.BuyerCode || null,
            DesignColor: lastDetail ? lastDetail.DesignColor : item.DesignColor,
            FabricType: lastDetail ? lastDetail.FabricType : item.FabricType,
            Quantity: 0,
            POSerialNumber: lastDetail ? lastDetail.POSerialNumber : '',
            DOItemId : lastDetail ? lastDetail.DOItemId : item.DOItemId,
            DOCurrencyRate : 0,
            Conversion : 0,
            Rack:'',
            Level: '',
            Box: '',
            Colour:'',
            Area: '',
            IsSave: lastDetail ? lastDetail.IsSave : true,
            IsDisabled: false,
            index: nextIndex,
        });
       
    };
  }

  removeDetails(detail, event) {
    if (event) event.preventDefault();
    if (!Array.isArray(this.data.Details)) {
        this.data.Details =  this.data[this.data.length - 1];
        return;
    }

    const index = this.data.Details.indexOf(detail);

    if (index > -1) {
        this.data.Details.splice(index, 1);
    }
    this.data.Details = [...this.data.Details];
    }

  detailsColumns = [
    { header: "Index" },
    { header: "No Ref PO" },
    { header: "Stock" },
    { header: "Quantity" },
    { header: "Satuan" },
    { header: "Colour" },
    { header: "Rack" },
    { header: "Box" },
    { header: "Level" },
    { header: "Area" },
  ];
}