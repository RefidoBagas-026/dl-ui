import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class Edit {
    isEdit = true;

    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    async activate(params) {
        var id = params.id;
        let decoded = Base64Helper.decode(id);
        id = decoded;
        this.data = await this.service.getById(id);

        this.error = {};
    }

    cancelCallback(event) {
        const encoded = Base64Helper.encode(this.data.Id);
        this.router.navigateToRoute('view', { id: encoded });
    }

    saveCallback(event) {
        var Items = [];
        // var dataSave = this.data;

        for (var item of this.data.ROList) {
            for (var detail of item.FabricItems) {
                var itemSave = {};
                if (detail.IsSave) {
                    itemSave.RONo = item.RONo;
                    itemSave.Product = detail.Product;
                    itemSave.ProductRemark = detail.ProductRemark;
                    itemSave.Quantity = detail.Quantity;
                    itemSave.Uom = detail.Uom;
                    itemSave.BCNo = detail.BCNo;
                    itemSave.BCDate = detail.BCDate;
                    itemSave.BCType = detail.BCType;
                    itemSave.Article = item.Article;
                    Items.push(itemSave);
                }
            }
        }

        this.data.Items = Items;

        this.service.update(this.data)
            .then(result => {
                const encoded = Base64Helper.encode(this.data.Id);
                this.router.navigateToRoute('view', { id: encoded });
            })
            .catch(e => {
                this.error = e;
            })
    }
}
