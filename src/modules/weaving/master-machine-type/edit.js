import { inject, Lazy } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Service } from "./service";
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class Edit {
  constructor(router, service) {
    this.router = router;
    this.service = service;
    this.error = {};
  }

  async activate(params) {
    var Id = params.Id;
    let decoded = Base64Helper.decode(Id);  
    Id = decoded;
    this.data = await this.service.getById(Id);
  }

  cancelCallback(event) {
    const encoded = Base64Helper.encode(this.data.Id);
    this.router.navigateToRoute("view", { Id: encoded });
  }

  saveCallback(event) {
    let errorIndex = 0;
    this.error = {};

    var CodeRegEx = new RegExp("([1-9])");
    if (!this.data.TypeName || this.data.TypeName === "") {
      this.data.TypeName = "";
    }

    if (!this.data.Speed) {
      this.data.Speed = 0;
    } else {
      if (!CodeRegEx.test(this.data.Speed)) {
        this.error.Speed = "Only Numbers (1-9) Allowed";
        errorIndex++;
      }
    }

    if (!this.data.MachineUnit || this.data.MachineUnit === "") {
      this.data.MachineUnit = "";
    }

    if (errorIndex == 0) {
    this.service
      .update(this.data)
      .then(result => {
        const encoded = Base64Helper.encode(this.data.Id);
        this.router.navigateToRoute("view", { Id: encoded });
      })
      .catch(e => {
        this.error = e;
      });
    }
  }
}
