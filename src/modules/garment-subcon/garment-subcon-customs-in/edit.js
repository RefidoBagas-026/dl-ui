import { inject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Service } from "./service";
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class Edit {
  isEdit = true;
  constructor(router, service, salesService) {
    this.router = router;
    this.service = service;
    this.salesService = salesService;
  }

  async activate(params) {
    let id = params.id;
    let decoded = Base64Helper.decode(id);
    id = decoded;
    this.data = await this.service.read(id);
  }

  bind() {
    this.error = {};
  }

  cancelCallback(event) {
    const encoded = Base64Helper.encode(this.data.Id);
    this.router.navigateToRoute("view", { id: encoded });
  }

  saveCallback(event) {
    this.service
      .update(this.data)
      .then((result) => {
        this.cancelCallback();
      })
      .catch((e) => {
        this.error = e;
      });
  }
}
