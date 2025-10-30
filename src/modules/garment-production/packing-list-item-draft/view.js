import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class View {

    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    formOptions = {
        cancelText: "Back",
        saveText: "Unpost"
    }

    async activate(params) {
        var id = params.id;
        var idDecoded =  Base64Helper.decode(id);
        this.item = await this.service.getById(idDecoded);
        
        this.data={items : []};
        this.data.items.push(this.item);
    }

    sumSubTotal(item) {
      item.subGrossWeight = 0;
      item.subNetWeight = 0;
      item.subNetNetWeight = 0;
      const newDetails = item.details.map(d => {
        return {
          carton1: d.carton1,
          carton2: d.carton2,
          cartonQuantity: d.cartonQuantity,
          grossWeight: d.grossWeight,
          netWeight: d.netWeight,
          netNetWeight: d.netNetWeight
        };
      }).filter((value, index, self) => self.findIndex(f => value.carton1 == f.carton1 && value.carton2 == f.carton2) === index);
      for (const detail of newDetails) {
        const cartonExist = false;
        const indexItem = this.data.items.indexOf(item);
        if (indexItem > 0) {
          for (let i = 0; i < indexItem; i++) {
            const item = this.data.items[i];
            for (const prevDetail of item.details) {
              if (detail.carton1 == prevDetail.carton1 && detail.carton2 == prevDetail.carton2) {
                cartonExist = true;
                break;
              }
            }
          }
        }
        if (!cartonExist) {
              item.subGrossWeight += detail.grossWeight * detail.cartonQuantity;
              item.subNetWeight += detail.netWeight * detail.cartonQuantity;
              item.subNetNetWeight += detail.netNetWeight * detail.cartonQuantity;
        }
      }
    }

    cancelCallback(event) {
        this.router.navigateToRoute('list');
    }

    editCallback(event) {
      var idEncoded = Base64Helper.encode(this.data.id);
        this.router.navigateToRoute('edit', { id: idEncoded });
    }

    deleteCallback(event) {
      if (confirm("Hapus?")) {
          this.service.delete(this.item).then(result => {
              this.cancelCallback();
          });
      }
  }
}
