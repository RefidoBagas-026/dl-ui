import { inject } from 'aurelia-framework';
import { Service } from "./service";
import { Router } from 'aurelia-router';
import moment from "moment";
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class List {
    context = ["detail"];
    columns = [
    {
      field: "Date",
      title: "Tanggal",
      formatter: function (value, data, index) {
        return moment(value).format("DD MMM YYYY");
      },
    },
    { field: "BonNo", title: "Nama Barang" },
    { field: "BonType", title: "Dari" },
    { field: "StorageName", title: "Tujuan" },
    { field: "Type", title: "Status" },
  ];

  loader = (info) => {
    var order = {};
    if (info.sort)
      order[info.sort] = info.order;

    var arg = {
      page: parseInt(info.offset / info.limit, 10) + 1,
      size: info.limit,
      keyword: info.search,
      order: order
    }

    // return this.service.search(arg)
    //   .then(result => {
       
    //     console.log(result.data);
    //     return {
    //       total: result.info.total,
    //       data: result.data

        
    //     }
        
    //   });

      return this.service.search(arg).then((result) => {
        var data = {};
        data.total = result.Count;
        data.data = result.Data;
        return data;
      });
  }

    constructor(router, service) {
        this.service = service;
        this.router = router;
        this.accessoriesId = "";
        this.accessories = [];
    }

    contextCallback(event) {
    var arg = event.detail;
    var data = arg.data;
    const encoded = Base64Helper.encode(data.Id);
    switch (arg.name) {
      case "detail":
        this.router.navigateToRoute('view', { id: encoded });
        break;
    }
  }

    upload() {
        this.router.navigateToRoute('upload');
    }
    
    create() {
        this.router.navigateToRoute('create');
    }

    monitoring() {
      this.router.navigateToRoute('monitoring');
    }

}
