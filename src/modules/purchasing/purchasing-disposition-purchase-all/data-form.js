import {
  inject,
  bindable,
  containerless,
  computedFrom,
  BindingEngine,
  TaskQueue,
} from "aurelia-framework";
import { Service } from "./service";
import { AuthService } from "aurelia-authentication";
var UnitLoader = require('../../../loader/unit-loader');
import moment from "moment";

@inject(Service, BindingEngine, AuthService, TaskQueue)
export class DataForm {
  @bindable readOnly = false;
  @bindable data = {};
  @bindable error = {};
  @bindable title;
  @bindable options = {};
  @bindable unitDeliveryOrder;
  @bindable unit;
  @bindable TypeDisposition;

  dispositionTypes = ["Disposisi Pembelian"];

  controlOptions = {
    label: {
      align: "right",
      length: 5,
    },
    control: {
      length: 5,
      align: "right",
    },
  };

  constructor(service, bindingEngine, authService, taskQueue) {
    this.service = service;
    this.bindingEngine = bindingEngine;
    this.authService = authService;
    this.taskQueue = taskQueue;
    this._itemSubscriptions = new Map();
  }

  bind(context) {
    this.context = context;
    this.data = this.context.data;
    this.error = this.context.error;
    this.isItem = false;
    this.isEdit = this.data.Id ? true : false;

    if (!this.data.items) {
      this.data.items = [];
    }
    if (this.data.items)
    if (this.data.items && this.data.items.length > 0) {
      this.isItem = true;
    }
    if (this.data.items && this.data.items.length > 0) {
      for (let it of this.data.items) {
        this.subscribeItem(it);
      }
    }
    this.options.readOnly = this.readOnly;
    this.options.isEdit = this.isEdit;
    this.options.add = () => {
      this.addItems();
    };

    this.options.calculateTotalPrice = (item) => {
      this.calculateTotalPrice(item);
    };

    this.options.remove = (item) => {
      if (!this.data.items) return;
      this.unsubscribeItem(item);
      var index = this.data.items.indexOf(item);
      if (index > -1) this.data.items.splice(index, 1);
    };

    this.readOnlySender = true;
   
    this.TypeDisposition = this.data.TypeDisposition || "Disposisi Pembelian";
    this.data.TypeDisposition = this.TypeDisposition;
    this.isItem = !!this.TypeDisposition;
  
  }

  addItems() {
    if (!this.data.items) {
      this.data.items = [];
    }
    var item = { 
      TotalPrice: 0,
      ProductPrice : 0,
      PriceDifference: 0,
      Percentage: 0,
      IsNew: true
    };
    this.data.items.push(item);
    this.subscribeItem(item);
  }

  disposeSubscription(sub) {
    try {
      if (sub && typeof sub.dispose === 'function') sub.dispose();
      else if (typeof sub === 'function') sub();
    } catch (e) {}
  }

  observe(item, prop) {
  try {
    return this.bindingEngine
      .propertyObserver(item, prop)
      .subscribe(() => this.calculateTotalPrice(item));
  } catch (e) {
    return null;
  }
}

  subscribeItem(item) {
  if (!item) return;

  const subs = [
    this.observe(item, 'quantity'),
    this.observe(item, 'product.price'),
 
  ].filter(Boolean);

  this._itemSubscriptions.set(item, subs);
  this.calculateTotalPrice(item);
}

  unsubscribeItem(item) {
    const subs = this._itemSubscriptions.get(item) || [];
    subs.forEach(s => this.disposeSubscription(s));
    this._itemSubscriptions.delete(item);
  }

  get items() {
    return { 
      columns: [
        "Supplier",
        "Nama Barang",
        "Brand",
        "Description",
        "Mata Uang",
        "Jumlah Barang",
        "Satuan",
        "Harga Satuan",
        "Harga Total",
      ] 
    };
  }

  dispositionTypeChanged(event) {
    this.data.TypeDisposition = this.TypeDisposition;
    this.isItem = !!this.TypeDisposition;

    if (this._itemSubscriptions) {
      for (const subs of this._itemSubscriptions.values()) {
        subs.forEach(s => this.disposeSubscription(s));
      }
      this._itemSubscriptions.clear();
    }
    
    if (!this.data.items) {
      this.data.items = [];
    } else {
      this.data.items.length = 0;
    }
    
    if (this.error) {
      this.error.items = [];
    }
  }


  calculateTotalPrice(item) {
    var qty = Number(item.quantity) || 0;
    var price = Number(item.product.price) || 0;
    item.totalPrice = qty * price;
  }

  unbind() {
      this.disposeSubscription(this.expenditureDateSubscription);

      if (!this._itemSubscriptions) return;

      for (const subs of this._itemSubscriptions.values()) {
        subs.forEach(s => this.disposeSubscription(s));
      }

      this._itemSubscriptions.clear();
    }

}

