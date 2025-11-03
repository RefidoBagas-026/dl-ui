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
    var id = params.id;
    let decoded = Base64Helper.decode(id);  
    id = decoded;
    this.data = await this.service.getById(id);
  }

  cancelCallback(event) {
    const encoded = Base64Helper.encode(this.data.id);
    this.router.navigateToRoute("view", { id: encoded });
  }

  saveCallback(event) {
    this.error = {};
    var index = 0;
    var emptyFieldName = "Semua Field Harus Diisi";

    if (
      this.data.code == null ||
      this.data.code == undefined ||
      this.data.code == ""
    ) {
      this.error.code = "Kode Ring Tidak Boleh Kosong";
      index++;
    }
    if (
      this.data.number == null ||
      this.data.number == undefined ||
      this.data.number == ""
    ) {
      this.error.number = "Ukuran Ring Tidak Boleh Kosong";
      index++;
    }
    if (index > 0) {
      window.alert(emptyFieldName);
    } else {
      this.service
        .update(this.data)
        .then(result => {
          const encoded = Base64Helper.encode(this.data.id);
          this.router.navigateToRoute("view", { id: encoded });
        })
        .catch(e => {
          this.error = e;
        });
    }
  }
}
