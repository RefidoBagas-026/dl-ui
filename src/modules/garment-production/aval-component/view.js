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
        var idDecoded = Base64Helper.decode(id);
        this.data = await this.service.read(idDecoded);

        if (this.data) {
            this.selectedCuttingIn = {
                RONo: this.data.RONo
            };
            this.selectedSewingOut = {
                RONo: this.data.RONo
            };

            if (this.data.Items) {
                for (const item of this.data.Items) {
                    if (item.RemainingQuantity < item.Quantity) {
                        this.deleteCallback = null;
                    }
                    item.IsSave=true;
                }
            }
        }
    }

    cancelCallback(event) {
        this.router.navigateToRoute('list');
    }

    deleteCallback(event) {
        if (confirm(`Hapus ${this.data.AvalComponentNo}?`))
            this.service.delete(this.data)
                .then(result => {
                    this.cancelCallback();
                })
                .catch(e => {
                    this.error = e;
                })
    }
}