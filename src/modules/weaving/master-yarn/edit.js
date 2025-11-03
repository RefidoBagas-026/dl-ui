import { inject, Lazy } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Service } from "./service";
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class Edit {
  showViewEdit = true;
  readOnlyViewEdit = true;
  createOnly = false;
  // error = {};
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
    this.error = {};
    if (
      this.data.MaterialTypeId == undefined ||
      this.data.MaterialTypeId == null ||
      this.data.MaterialTypeId == ""
    ) {
      this.data.MaterialTypeId = "";
    } else {
      var yarnMaterialId = this.data.MaterialTypeId.Id
        ? this.data.MaterialTypeId.Id
        : "";
      this.data.MaterialTypeId = yarnMaterialId;
    }

    if (
      this.data.YarnNumberId == undefined ||
      this.data.YarnNumberId == null ||
      this.data.YarnNumberId == ""
    ) {
      this.data.YarnNumberId = "";
    } else {
      var yarnNumberId = this.data.YarnNumberId.Id
        ? this.data.YarnNumberId.Id
        : "";
      this.data.YarnNumberId = yarnNumberId;
    }

    if (
      this.data.Code == undefined ||
      this.data.Code == null ||
      this.data.Code == ""
    ) {
      this.data.Code = "";
    }

    if (this.data.MaterialTypeId == "" || this.data.YarnNumberId == "") {
      this.data.Name = "";
    }

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
