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
    this.error = {};
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

  cancelCallback(event) {
    const encoded = Base64Helper.encode(this.data.Id);
    this.router.navigateToRoute("view", { Id: encoded });
  }

  saveCallback(event) {
    // this.error = {};
    // var index = 0;
    // var emptyFieldName = "Semua Field Harus Diisi";

    // if (
    //   this.data.code == null ||
    //   this.data.code == undefined ||
    //   this.data.code == ""
    // ) {
    //   this.error.code = "Kode Material Tidak Boleh Kosong";
    //   index++;
    // }
    // if (
    //   this.data.name == null ||
    //   this.data.name == undefined ||
    //   this.data.name == ""
    // ) {
    //   this.error.name = "Nama Material Tidak Boleh Kosong";
    //   index++;
    // }
    // if (index > 0) {
    //   window.alert(emptyFieldName);
    // } else {
    this.service
      .update(this.data)
      .then(result => {
        const encoded = Base64Helper.encode(this.data.Id);
        this.router.navigateToRoute("view", { Id: encoded });
      })
      .catch(e => {
        this.error = e;
      });
    // }
  }
}
