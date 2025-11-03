import {
  inject
} from "aurelia-framework";
import {
  Router
} from "aurelia-router";
import {
  Service
} from "./service";
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class View {
  constructor(router, service) {
    this.router = router;
    this.service = service;
  }

  async activate(params) {

    var Id = params.Id;
    let decoded = Base64Helper.decode(Id);  
    Id = decoded;
    var dataResult;
    this.data = await this.service
      .getById(Id)
      .then(result => {
        dataResult = result;
        return this.service.getUnitById(dataResult.UnitId);
      })
      .then(unit => {
        dataResult.WeavingUnit = unit;
        return this.service.getMachineTypeById(dataResult.MachineTypeId);
      }).then(machineType => {
        dataResult.MachineType = machineType;
        dataResult.Speed = machineType.Speed;
          return dataResult;
      });
  }

  list() {
    this.router.navigateToRoute("list");
  }

  cancelCallback(event) {
    this.list();
  }

  editCallback(event) {
    const encoded = Base64Helper.encode(this.data.Id);
    this.router.navigateToRoute("edit", {
      Id: encoded
    });
  }

  deleteCallback(event) {
    this.service.delete(this.data).then(result => {
      this.cancelCallback(event);
    });
  }
}
