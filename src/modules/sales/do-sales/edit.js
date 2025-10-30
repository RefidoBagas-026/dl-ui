import { inject, Lazy } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Service } from "./service";
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class Edit {
  constructor(router, service) {
    this.router = router;
    this.service = service;
  }

  async activate(params) {
    var id = params.id;
    let decoded = Base64Helper.decode(id);
    id = decoded;
    this.data = await this.service.getById(id);
  }

  view(data) {
    const encoded = Base64Helper.encode(this.data.Id);
    this.router.navigateToRoute("view", { id: encoded });
  }

  save() {
    console.log("data", this.data);
    if(this.data.DOSalesCategory === "DYEINGPRINTING")
      {

        this.data.SalesContract ={
          Buyer : {
            Name : this.data.BuyerName,
            Address : this.data.BuyerAddress,
            Type : this.data.DOSalesType
          },
          

        };
        
        this.data.SalesContract.SalesContractNo = this.data.SalesContractNo;

      }
    this.service
      .update(this.data)
      .then((result) => {
        this.view();
      })
      .catch((e) => {
        this.error = e;
      });
  }
}
