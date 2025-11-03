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
    var Id = params.Id;
    let decoded = Base64Helper.decode(Id);  
    Id = decoded;
    var dataResult;
    this.data = await this.service.getById(Id)
      .then(result => {
        dataResult = result;
        return this.service.getUnitById(result.UnitDepartementId);
      })
      .then(unit => {

        if (unit) {
          dataResult.WeavingUnit = unit;
        }

        return this.service.getUserById(dataResult.UserMaintenanceId);
      })
      .then(userMaintenance => {

        if (userMaintenance) {
          dataResult.UserMaintenance = userMaintenance;
        }

        return this.service.getUserById(dataResult.UserOperatorId);
      })
      .then(userOperator => {

        if (userOperator) {
          dataResult.UserOperator = userOperator;
        }

        return dataResult;
      });
  }

  cancelCallback(event) {
    const encoded = Base64Helper.encode(this.data.Id);
    this.router.navigateToRoute("view", { Id: encoded });
  }

  saveCallback(event) {
    this.error = {};

    if (!this.data.Area) {
      
      this.data.Area = "";
    }

    if (!this.data.Blok) {

      this.data.Blok = "";
    }

    if (!this.data.BlokKaizen) {

      this.data.BlokKaizen = "";
    }

    if (!this.data.MachineId) {
      this.data.MachineId = "00000000-0000-0000-0000-000000000000";
    }

    if (!this.data.UnitDepartementId) {
      this.data.UnitDepartementId = 0;
    }

    if (!this.data.UserMaintenanceId) {
      this.data.UserMaintenanceId = "";
    }

    if (!this.data.UserOperatorId) {
      this.data.UserOperatorId = "";
    }

    this.service
      .update(this.data)
      .then(result => {
        const encoded = Base64Helper.encode(this.data.Id);
        this.router.navigateToRoute("view", { Id: encoded });
      })
      .catch(e => {
        this.error = e;
        this.error.WeavingUnit = e['UnitDepartementId'] ? 'Unit must not be empty' : '';
        this.error.Machine = e['MachineId'] ? 'Machine must not be empty' : '';

        if (this.error.Machine != '')  {
          this.error.Location = 'Machine must not be empty';
        }

        this.error.UserMaintenance = e['UserMaintenanceId'] ? 'User must not be empty' : '';
        this.error.UserOperator = e['UserOperatorId'] ? 'User must not be empty' : '';
      });
  }
}
