import { inject, Lazy } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Service } from "./service";
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class View {
  onViewEdit = true;
  constructor(router, service) {
    this.router = router;
    this.service = service;
    this.data = {};
  }

  async activate(params) {
    let Id = params.Id;
    let decoded = Base64Helper.decode(Id);  
    Id = decoded;
    // var Id = params.Id;
    // this.data = await this.service.getById(Id);
    this.data = {
      Id: 1,
      MachineNumber: "1/2",
      Production: "165",
      SCMPX: "124",
      EFF: "673",
      RPM: "525",
      T: "26",
      F: "6",
      W: "5",
      L: "2",
      H: "8"
    };
  }

  list() {
    this.router.navigateToRoute("list");
  }

  cancelCallback(event) {
    this.list();
  }

  editCallback(event) {
    const encoded = Base64Helper.encode(this.data.Id);
    this.router.navigateToRoute("edit", { Id: encoded });
  }

  deleteCallback(event) {
    this.service.delete(this.data).then(result => {
      this.cancelCallback(event);
    });
  }
}
