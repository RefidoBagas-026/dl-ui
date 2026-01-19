import { inject, Lazy } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Service, ProductionService } from "./service";
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service, ProductionService)
export class View {
  hasCancel = true;
  hasEdit = true;
  hasDelete = true;

  constructor(router, service, productionService) {
    this.router = router;
    this.service = service;
    this.productionService = productionService;
  }
  async activate(params) {
    var id = params.id;
    let decoded = Base64Helper.decode(id);
    id = decoded;
    this.data = await this.service.getById(id);
    
    if (this.data.Items) {
      for (let item of this.data.Items) {
        item.IsSave = true;
      }
    }
  


    // if (this.data.IsTransfered) {
    //   this.hasEdit = false;
    //   this.hasDelete = false;
    // } else if (
    //   !this.data.IsTransfered &&
    //   this.data.ExpenditureType === "TRANSFER"
    // ) {
    //   var uen = await this.service.getUENById(this.data.Id);
    //   if (!uen.IsPreparing) {
    //     this.hasEdit = false;
    //     this.hasDelete = true;
    //   } else {
    //     this.hasEdit = false;
    //     this.hasDelete = false;
    //   }
    // }

    // if (this.data.ExpenditureType === "TRANSFER") {
    //   let unitDOResult = await this.service.searchUnitDO({
    //     size: 1,
    //     filter: JSON.stringify({ UENFromId: this.data.Id }),
    //   });
    //   let unitDO = unitDOResult.data[0];
    //   if (unitDO) {
    //     let DRResult = await this.productionService.getGarmentDR({
    //       size: 1,
    //       filter: JSON.stringify({ UnitDOId: unitDO.Id }),
    //     });
    //     let DR = DRResult.data[0];
    //     if (DR) {
    //       this.hasEdit = false;
    //       this.hasDelete = false;
    //     }
    //   }
    // }

    // if (this.data.ExpenditureType === "TRANSFER SUBCON") {
    //   let unitDOResult = await this.service.searchUnitDO({
    //     size: 1,
    //     filter: JSON.stringify({ UENFromId: this.data.Id }),
    //   });
    //   let unitDO = unitDOResult.data[0];
    //   if (unitDO) {
    //     let UENResult = await this.service.search({
    //       size: 1,
    //       filter: JSON.stringify({ UnitDOId: unitDO.Id }),
    //     });

    //     let UEN = UENResult.data[0];
    //     if (UEN) {
    //       if (UEN.IsPreparing) {
    //         this.hasEdit = false;
    //         this.hasDelete = false;
    //       }
    //     }
    //   }
    // }

    if (this.data.IsReceived) {
      this.hasEdit = false;
      this.hasDelete = false;
    }
  }

  cancel(event) {
    var r = confirm("Apakah anda yakin akan keluar?");
    if (r == true) {
      this.router.navigateToRoute("list");
    }
  }

  edit(event) {
    const encoded = Base64Helper.encode(this.data.Id);
    var r = confirm("Apakah anda yakin akan mengubah data ini?");
    if (r == true) {
      this.router.navigateToRoute("edit", { id: encoded });
    }
  }

  delete(event) {
    var r = confirm("Apakah anda yakin akan menghapus data ini?");
    if (r == true) {
      this.service.delete(this.data).then((result) => {
        this.cancel();
      });
    }
  }
}
