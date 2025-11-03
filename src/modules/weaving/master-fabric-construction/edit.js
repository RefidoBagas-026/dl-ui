import { inject, Lazy } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Service } from "./service";
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class Edit {
  onViewEdit = true;
  constructor(router, service) {
    this.router = router;
    this.service = service;
    // this.data = {};
    this.error = {};
  }

  async activate(params) {
    var Id = params.Id;
    let decoded = Base64Helper.decode(Id);  
    Id = decoded;
    this.data = await this.service.getById(Id);
    // this.MaterialTypeName = this.data.MaterialTypeName;
  }

  cancelCallback(event) {
    const encoded = Base64Helper.encode(this.data.Id);
    this.router.navigateToRoute("view", { Id: encoded });
  }

  saveCallback(event) {
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
