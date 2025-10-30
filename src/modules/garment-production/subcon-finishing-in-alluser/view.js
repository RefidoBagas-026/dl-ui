import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class View {
    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    async activate(params) {
        let id = params.id;
        this.editCallback = null;
        var idDecoded = Base64Helper.decode(id);
        this.data = await this.service.read(idDecoded);

        this.data.ViewItems = [];
        for (const item of this.data.Items) {
            this.data.ViewItems.push(Object.assign({
                product: item.Product.Code,
                size: item.Size.Size,
                uom: item.Uom.Unit
            }, item));

            if (item.RemainingQuantity < item.Quantity) {
                this.deleteCallback = null;
            }
        }

        this.data.Supplier = {};
        this.selectedURN = {
            DONo: this.data.DONo
        };
        this.selectedRONo = this.data.RONo;
    }

    cancelCallback(event) {
        this.router.navigateToRoute('list');
    }

    // editCallback(event) {
    //     this.router.navigateToRoute('edit', { id: this.data.Id });
    // }

    // deleteCallback(event) {
    //     if (confirm(`Hapus?`))
    //         this.service.delete(this.data)
    //             .then(result => {
    //                 alert(`delete data success`);
    //                 this.cancelCallback();
    //             })
    //             .catch(e => {
    //                 this.error = e;
    //             })
    // }
}