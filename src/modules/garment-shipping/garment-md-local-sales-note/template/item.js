import { inject,computedFrom } from "aurelia-framework";
const UomLoader = require("../../../../loader/uom-loader");
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

    if (this.data.id)
      this.isShowing = true;
  }

  details = {
    columns: [
      "No Bon Keluar",
      "Quantity",
      "Satuan",
      "Asal",
      //   "Harga",
      //   "Jumlah",
      //   "Total",
    ],
    onAdd: function () {
      this.data.details.push({});
    }.bind(this),
    onRemove: function (event) {
      // Assuming event contains the bonNo to be removed
      const bonNoToRemove = event.detail.bonNo;
    
      // Retrieve the existing cache
      let bonNoList = JSON.parse(localStorage.getItem('bonNoList')) || [];
    
      // Remove the specified item from the array
      bonNoList = bonNoList.filter(item => item !== bonNoToRemove);
    
      // Save the updated cache back to localStorage
      localStorage.setItem('bonNoList', JSON.stringify(bonNoList));
    }.bind(this),
  };

  get uomLoader() {
    return UomLoader;
}

  toggle() {
    this.isShowing = !this.isShowing;
  }

  get total() {
    this.data.amount = this.data.quantity * this.data.price;

    return this.data.amount;
  }

  uomView = (data) => {
    return `${data.Unit || data.unit || ""}`;
  }

   get setNo(){
      console.log(this.context,"context");
  }
}
