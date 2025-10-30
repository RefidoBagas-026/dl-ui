import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../../../utils/base-64-coded-helper';

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
        this.data.Items = [];
        var same = [];
        if (this.data.DataItems) {
            for (var exGood of this.data.DataItems) {
                var quantity = 0;
                if (exGood.dataDetails) {
                    for (var detail of exGood.dataDetails) {
                        var dataItem = {};
                        dataItem.Id = detail.Id;
                        dataItem.ExpenditureGoodId = exGood.ExpenditureGoodId;
                        dataItem.ExpenditureGoodNo = exGood.ExpenditureGoodNo;
                        dataItem.RONo = exGood.RONo;
                        dataItem.Article = exGood.Article;
                        dataItem.Comodity = exGood.Comodity;
                        dataItem.Buyer = exGood.Buyer;
                        dataItem.ExpenditureGoodItemId = detail.ExpenditureGoodItemId;
                        dataItem.Quantity = detail.qty;
                        quantity += detail.qty;
                        dataItem.LeftoverComodity = detail.LeftoverComodity || null;
                        dataItem.BasicPrice = detail.BasicPrice;
                        this.data.Items.push(dataItem);
                    }
                }
                else {
                    this.data.Items.push({});
                }
                if (quantity != exGood.Quantity) {
                    same += `- ${exGood.ExpenditureGoodNo} \n`;
                }
            }
        }
        if (same.length > 0) {
            alert(`${same} \n Jumlah total Breakdown belum sama dengan jumlah per bon pengeluaran.`)
        }
        else {
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
}