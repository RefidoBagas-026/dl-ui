import { inject, Lazy } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Service } from "./service";
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class Edit {
  showViewEdit = true;
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
    this.data.Name = await this.service.getCoreSupplierById(
      this.data.CoreSupplierId
    );
  }

  cancelCallback(event) {
    const encoded = Base64Helper.encode(this.data.Id);
    this.router.navigateToRoute("view", { Id: encoded });
  }

  saveCallback(event) {
    if (this.data.Name) {
      if (this.data.Name.name) {
        var supplierName = this.data.Name.name ? this.data.Name.name : "";
        var supplierId = this.data.Name._id ? this.data.Name._id : "";
        this.data.Name = supplierName;
        this.data.CoreSupplierId = supplierId;
      } else {
        var supplierName = "";
        var supplierId = "";
        this.data.Name = supplierName;
        this.data.CoreSupplierId = supplierId;
      }
    }
    
    this.service
      .update(this.data)
      .then(result => {
        const encoded = Base64Helper.encode(this.data.Id);
        this.router.navigateToRoute("list", { Id: encoded });
      })
      .catch(e => {
        this.error = e;
      });
  }
}
