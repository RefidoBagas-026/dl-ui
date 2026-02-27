import { inject, Lazy } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Service } from "./service";
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class View {
  hasCancel = true;
  hasEdit = true;
  hasDelete = true;
  hasUnpost = false;
  dispoId = "";

  constructor(router, service) {
    this.router = router;
    this.service = service;
  }
  async activate(params) {
    var id = params.id;
    let decoded = Base64Helper.decode(id);
    this.dispoId = decoded;
    id = decoded;
    this.data = await this.service.getById(id);
    
    if (!this.data.IsPosted) {
            this.hasEdit = true;
            this.hasDelete = true;
        } else {
            if (!this.data.IsUsed) {
                this.hasUnpost = true;
            }
        }

    if (this.hasUnpost) {
        this.hasEdit = false;
        this.hasDelete = false;
    }

    if (this.data.Items) {
      for (let item of this.data.Items) {
        item.IsSave = true;
      }
    }
  

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
  unpost(event) {
        this.service.unpost(this.dispoId).then(result => {
            this.cancel();
        }).catch(e => {
            this.error = e;
        })
    }
}
