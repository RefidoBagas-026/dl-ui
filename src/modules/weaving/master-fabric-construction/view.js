import { inject, Lazy, bindable } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Service } from "./service";
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class Create {
  onViewEdit = true;
  constructor(router, service) {
    this.router = router;
    this.service = service;
    this.data = {};
  }

  async activate(params) {
    var Id = params.Id;
    let decoded = Base64Helper.decode(Id);  
    Id = decoded;
    this.data = await this.service.getById(Id);
    this.MaterialType = this.data.MaterialType;
    this.ConstructionNumber = this.data.ConstructionNumber;
    this.WarpType = this.data.WarpType;
    this.WeftType = this.data.WeftType;
    this.TotalYarn = this.data.TotalYarn;
  }

  //Dipanggil ketika tombol "Kembali" ditekan
  list() {
    this.router.navigateToRoute("list");
  }

  //Tombol "Kembali", panggil list()
  cancelCallback(event) {
    this.list();
  }

  //Tombol "Ubah", routing ke 'edit'
  editCallback(event) {
    const encoded = Base64Helper.encode(this.data.Id);
    this.router.navigateToRoute("edit", { Id: encoded });
  }

  //Tombol "Hapus", hapus this.data, redirect ke list
  deleteCallback(event) {
    this.service.delete(this.data).then(result => {
      this.list();
    });
  }
}
