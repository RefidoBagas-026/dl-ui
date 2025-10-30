import { inject, Lazy } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Service } from "./service";
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class Edit {
  hasCancel = true;
  hasSave = true;
  hasView = false;
  hasCreate = false;
  isEdit = true;

  constructor(router, service) {
    this.router = router;
    this.service = service;
  }

  bind() {
    this.error = {};
  }

  async activate(params) {
    var id = params.id;
    let decoded = Base64Helper.decode(id);
    id = decoded;
    this.data = await this.service.getById(id);
    this.supplier = this.data.supplier;
    this.cc = {
      RO_Number: this.data.roNo,
    };

    var newItems = this.data.items.filter((x) => x.PRItemId == 0);
    this.data.itemsPR = this.data.items.filter((x) => x.PRItemId != 0);

    this.data.items = newItems;
  }

  cancel(event) {
    const encoded = Base64Helper.encode(this.data.Id);
    this.router.navigateToRoute("view", { id: encoded });
  }

  save(event) {
    this.service
      .update(this.data)
      .then((result) => {
        this.cancel();
      })
      .catch((e) => {
        this.error = e;
      });
  }
}
