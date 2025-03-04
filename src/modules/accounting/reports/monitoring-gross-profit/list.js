import { inject, bindable } from "aurelia-framework";
import { Service } from "./service";
import { formatAccountingNumber } from "../../../../utils/accounting-utils";
var moment = require("moment");

@inject(Service)
export class List {
  constructor(service) {
    this.service = service;
    this.showData = false;
  }

  async bind(context) {
    this.context = context;
  }

  controlOptions = {
    label: {
      length: 4,
    },
    control: {
      length: 4,
    },
  };
  search() {
    this.searching();
  }

  activate() {}

  tableData = [];

  formatNumber(value) {
    return formatAccountingNumber(value); // Call the function
  }
  searching() {
    var args = {
      dateTo: this.dateTo ? moment(this.dateTo).format("YYYY-MM-DD") : "",
    };

    this.service.search(args).then((result) => {
      this.data = result.data;

      //get show data or not by checking the length of the data
      this.showData = Object.keys(this.data).length > 0;
    });
  }

  reset() {
    this.dateTo = "";
    this.data = {};
    this.showData = false;
  }

  ExportToExcel() {
    let args = {
      dateTo: this.dateTo ? moment(this.dateTo).format("YYYY-MM-DD") : "",
    };

    this.service.generateExcel(args);
  }
}
