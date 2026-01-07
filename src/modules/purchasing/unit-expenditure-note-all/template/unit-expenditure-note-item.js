import { bindable, computedFrom } from 'aurelia-framework'
import { Service } from "../service";
var PRLoader = require("../../../../loader/unit-receipt-loader");

export class UnitExpenditureNoteItem {

  async activate(context) {
    this.context = context;
    this.data = context.data;
    this.error = this.context.error;		
    // Prefer options from parent context (collection context.options)
    this.options = (this.context && this.context.context && this.context.context.options) || this.context.options || {};
    this.readOnly = this.options.readOnly || this.data.IsDisabled;
    this.data.selectedPRItem = this.data.PRNo;
    console.log("DATA ITEM",this.data);
    this.data.IsSave = !!this.data.IsSave;

    if (this.data.RemainingQuantity === undefined || this.data.RemainingQuantity === null) {
    this.data.RemainingQuantity = 0;
    }
 
    if (this.isEdit && this.data.URNItemId) {
      await this.loadRemainingQuantity();
    }
  }

   async loadRemainingQuantity() {
      try {
        const result = await PRLoader(this.data.PRNo || '');
        const urnItem = result.find(item => item.Id === this.data.URNItemId);
        if (urnItem) {
          this.data.RemainingQuantity = urnItem.RemainingQuantity || 0;
        } else {
          this.data.RemainingQuantity = 0;
        }
      } catch (error) {
        this.data.RemainingQuantity = 0;
      }
    }

  @computedFrom("data.Id")
    get isEdit() {
        return (this.data.Id || '').toString() != '';
    }

  changeCheckBox() {
    this.data.IsSave = !!this.data.IsSave;
  }

   @computedFrom("data.Id")
  get isEdit() {
    return (this.data.Id || '').toString() != '';
  }

  get usedPR() {
  if (!this.context.context || !this.context.context.items)
    return [];

  return this.context.context.items
    .filter(i => i.data && i.data.URNItemId)
    .map(i => i.data.URNItemId);
}

  get prLoader() {
    return async (keyword) => {
      const result = await PRLoader(keyword);
      const usedPR = this.usedPR;
      this.filteredPRItems = result.filter(item => {
        return !usedPR.includes(item.Id);
      });
      return this.filteredPRItems;
    }
  }

  PRView = (data) => {
      return `${data.PRNo || data.prNo}-${data.ProductName}-${data.RemainingQuantity}`;
  }

unitPRChanged(e) {
    const item = this.data.selectedPRItem;
    if (!item) return;
    this.data.URNItemId = item.Id;
    this.data.PRId = item.PRId;
    this.data.PRNo = item.PRNo;
    this.data.EPODetailId = item.EPODetailId;
    this.data.EPOId = item.EPOId;
    this.data.EPONo = item.EPONo;
    this.data.DODetailId = item.DODetailId;
    this.data.ProductId = item.ProductId;
    this.data.ProductCode = item.ProductCode;
    this.data.ProductName = item.ProductName;
    this.data.ProductRemark = item.ProductRemark;
    this.data.RemainingQuantity = item.RemainingQuantity;
    this.data.Uom = item.Uom;
    this.data.UomId = item.UomId;
    this.data.PricePerDealUnit = item.PricePerDealUnit; 

    delete this.data.selectedPRItem;
}
}