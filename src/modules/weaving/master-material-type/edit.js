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
    this.error = {};
    if (this.data.Name) {
      var whitespaceRegex = new RegExp("\\s");
      var name = this.data.Name;
      if (whitespaceRegex.test(name)) {
        this.error.Name = "Kode Tambahan Tidak Boleh Mengandung Spasi";
      } else {
        this.data.Name = "";
        this.data.Name = name;
      }
    }

    if (!this.error.Name) {
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
