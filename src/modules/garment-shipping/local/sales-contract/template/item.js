import {
  inject,
  bindable,
  containerless,
  computedFrom,
  BindingEngine,
} from "aurelia-framework";
const ProductLoader = require("../../../../../loader/garment-leftover-warehouse-product-loader");
const UomLoader = require("../../../../../loader/uom-loader");
var LeftoverComodityLoader = require("../../../../../loader/garment-comodities-loader");
import { Service } from "../service";

@inject(Service)
export class Item {
  constructor(service) {
    this.service = service;
  }

  activate(context) {
    this.context = context;
    this.data = context.data;
    this.error = context.error;
    this.options = context.options;
    this.buyerType = this.context.context.options.buyerType;

    if (this.data.product) {
      this.selectedProduct = this.data.product;
    }
  }

  get uomLoader() {
    return UomLoader;
  }

  get productFilter() {
    return {
      ProductTypeId: this.context.context.options.transactionTypeId,
    };
  }

  get leftoverComodityLoader() {
    return LeftoverComodityLoader;
  }

  uomView = (data) => {
    return `${data.Unit || data.unit}`;
  };

  get total() {
    this.data.amount = this.data.quantity * this.data.price;

    return this.data.amount;
  }

  comoView = (product) => {
    if (product.name === undefined)
      return `${product.Code} - ${product.Name}`;
    else if (product.name === null) return `-`;
    else return `${product.code} - ${product.name}`;
  };

  @bindable selectedProduct;
  selectedProductChanged(newValue, oldValue) {
    if (newValue) {
      this.data.product = {
        id: newValue.Id,
        code: newValue.Code,
        name: newValue.Name,
      };
    } else {
      this.data.product = null;
    }
  }
}
