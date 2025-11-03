import {
  inject
} from "aurelia-framework";
import {
  Service
} from "./service";
import {
  Router
} from "aurelia-router";
import { Base64Helper } from '../../../utils/base-64-coded-helper';
// import moment from "moment";

@inject(Router, Service)
export class List {
  constructor(router, service) {
    this.service = service;
    this.router = router;
  }

  context = ["Update"];
  columns = [{
      field: "DefectCode",
      title: "Kode"
    },
    {
      field: "DefectType",
      title: "Cacat"
    },
    {
      field: "DefectCategory",
      title: "Jenis"
    }
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

    return this.service.search(arg).then(result => {
      return {
        total: result.info.total,
        data: result.data
      };
    });
    // return {
    //   data: [{
    //     Id: 1,
    //     DefectCode: "DBL",
    //     DefectType: "Pakan Double",
    //     DefectCategory: "DOMINAN"
    //   }, {
    //     Id: 2,
    //     DefectCode: "RPT",
    //     DefectType: "Pakan Rapat",
    //     DefectCategory: "DOMINAN"
    //   }]
    // }
  }

  contextCallback(event) {
    var arg = event.detail;
    var data = arg.data;
    const encoded = Base64Helper.encode(data.Id);
    switch (arg.name) {
      case "Update":
        this.router.navigateToRoute("view", {
          Id: encoded
        });
        break;
    }
  }

  create() {
    this.router.navigateToRoute("create");
  }
}
