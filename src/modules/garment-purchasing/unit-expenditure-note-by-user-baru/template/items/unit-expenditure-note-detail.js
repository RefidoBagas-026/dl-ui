import { computedFrom } from 'aurelia-framework'

var DOItemsLoader = require('../../../../../loader/garment-do-items-loader');


export class UnitExpenditureNoteDetail {
  allDOItems = [];

  async activate(context) {
    this.context = context;
    this.data = context.data;
    this.error = this.context.error;
    this.options = this.context.options;    
    this.readOnly = this.options.readOnly || this.data.IsDisabled;
    this.ExpenditureType = this.context.context.options.ExpenditureType;

    if (this.data.RemainingQuantity === undefined || this.data.RemainingQuantity === null) {
      this.data.RemainingQuantity = 0;
    }
 
    if (this.isEdit && this.data.DOItemId) {
      await this.loadRemainingQuantity();
    }
  }

  async loadRemainingQuantity() {
    try {
      const result = await DOItemsLoader(this.data.POSerialNumber || '');
      const doItem = result.find(item => item.DOItemId === this.data.DOItemId);
      if (doItem) {
        this.data.RemainingQuantity = doItem.RemainingQuantity || 0;
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

  get usedPOSerialNumbers() {
  if (!this.context.context || !this.context.context.items)
    return [];

  return this.context.context.items
    .filter(i => i.data && i.data.DOItemId)
    .map(i => i.data.DOItemId);
}


get doItemsLoader() {
  return async (keyword) => {
    const result = await DOItemsLoader(keyword);
    const usedPOSerialNumbers = this.usedPOSerialNumbers;
    this.allDOItems = result.filter(item => {
      return !usedPOSerialNumbers.includes(item.DOItemId);
    });
    return this.filteredDOItems;
  }
}

@computedFrom("allDOItems", "data.ProductCode")
get filteredDOItems() {
  if (!this.data || !this.data.ProductCode) return [];

  return this.allDOItems.filter(item =>
    item.ProductCode === this.data.ProductCode
  );
}

DOView = (data) => {
      return `${data.POSerialNumber || data.poSerialNumber} - ${data.ProductCode || data.productCode} - ${data.Colour}-${data.RemainingQuantity}`;
  }

unitDOChanged(e) {
    const item = this.data.selectedDOItem;
    if (!item) return;
    this.data.POSerialNumber = item.POSerialNumber;
    this.data.DOItemId = item.DOItemId;
    this.data.URNItemId = item.URNItemId;
    this.data.Conversion = item.Conversion;
    this.data.ProductCode = item.ProductCode;
    this.data.Colour = item.Colour;
    this.data.Rack = item.Rack;
    this.data.Box = item.Box;
    this.data.Level = item.Level;
    this.data.Area = item.Area;
    this.data.UomUnit = item.SmallUomUnit;
    this.data.RemainingQuantity = item.RemainingQuantity;
    //this.data.Quantity = 0;
    this.data.PricePerDealUnit = item.PricePerDealUnit;
    this.data.DOCurrencyRate = item.DOCurrency;
}
}