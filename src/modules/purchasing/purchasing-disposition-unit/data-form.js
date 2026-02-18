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
var accountSignatureLoader = require('../../../loader/garment-account-signature-loader');
import moment from "moment";
import { filter } from "bluebird";

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
  @bindable IsApprovedUnit1;
  @bindable IsApprovedUnit2;

  dispositionTypes = ["Disposisi Permintaan Unit"];

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

    if (!this.data.Items) {
      this.data.Items = [];
    }
    if (this.data.Items)
    if (this.data.Items && this.data.Items.length > 0) {
      this.isItem = true;
    }
    if (this.data.Items && this.data.Items.length > 0) {
      for (let it of this.data.Items) {
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
      if (!this.data.Items) return;
      this.unsubscribeItem(item);
      var index = this.data.Items.indexOf(item);
      if (index > -1) this.data.Items.splice(index, 1);
    };

    this.readOnlySender = true;
   
    this.TypeDisposition = this.data.TypeDisposition || "Disposisi Permintaan Unit";
    this.data.TypeDisposition = this.TypeDisposition;
    this.IsApprovedUnit1 ={
      UserName: this.data.ApprovedUnit1By || ""
    };
    this.IsApprovedUnit2 = {
      UserName: this.data.ApprovedUnit2By || ""
    };
    this.isItem = !!this.TypeDisposition;
  
  }

  addItems() {
    if (!this.data.Items) {
      this.data.Items = [];
    }
    var item = { 
      TotalPrice: 0,
      ProductPrice : 0,
      PriceDifference: 0,
      Percentage: 0,
      IsNew: true
    };
    this.data.Items.push(item);
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
    this.observe(item, 'Quantity'),
    this.observe(item, 'ProductPrice'),
    this.observe(item, 'MasterPrice'),
    this.observe(item, 'UpdatePrice')
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
        "Nama Barang",
        "Jumlah Barang",
        "Satuan",
        "Mata Uang",
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
    
    if (!this.data.Items) {
      this.data.Items = [];
    } else {
      this.data.Items.length = 0;
    }
    
    if (this.error) {
      this.error.Items = [];
    }
  }


  calculateTotalPrice(item) {
    var qty = Number(item.Quantity) || 0;
    var price = Number(item.ProductPrice) || 0;
    item.TotalPrice = qty * price;
  }

  unbind() {
      this.disposeSubscription(this.expenditureDateSubscription);

      if (!this._itemSubscriptions) return;

      for (const subs of this._itemSubscriptions.values()) {
        subs.forEach(s => this.disposeSubscription(s));
      }

      this._itemSubscriptions.clear();
    }

    get accountSignatureLoader1() {
      return (keyword) => accountSignatureLoader(keyword,); //Username ganti dengan jabatan atau posisi dari Account Signature yang diinginkan
    }

    get accountSignatureLoader2() {
      return (keyword) => accountSignatureLoader(keyword); //Username ganti dengan jabatan atau posisi dari Account Signature yang diinginkan
    }
    ApprovedUnit1View = (unit) => {
        return `${unit.UserName}`;
    }
    ApprovedUnit2View = (unit) => {
        return `${unit.UserName}`;
    }

    IsApprovedUnit1Changed(newValue) {
      this.IsApprovedUnit1 = newValue;
      if (this.IsApprovedUnit1){
        this.data.ApprovedUnit1By = this.IsApprovedUnit1.UserName;
      }else{
        this.data.ApprovedUnit1By = "";
        this.IsApprovedUnit1 = null;
      }
    }

    IsApprovedUnit2Changed(newValue) {
      this.IsApprovedUnit2 = newValue;
      if (this.IsApprovedUnit2) {
        this.data.ApprovedUnit2By = this.IsApprovedUnit2.UserName;
      }else{
        this.data.ApprovedUnit2By = "";
        this.IsApprovedUnit2 = null;
      }
    }
}

