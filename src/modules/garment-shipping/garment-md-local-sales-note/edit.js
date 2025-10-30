import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

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
        this.selectedTransactionType = this.data.transactionType;

        if (this.data.items) {
            this.data.items.forEach(item => {
                item.productView = item.product.code + " - " + item.product.name;
            });
        }
        
    }

    cancelCallback(event) {
        const encoded = Base64Helper.encode(this.data.id);
        localStorage.removeItem('bonNoList');
        this.router.navigateToRoute('view', { id: encoded });
    }

    saveCallback(event) {
        this.service.update(this.data)
            .then(result => {
                const encoded = Base64Helper.encode(this.data.id);
                this.router.navigateToRoute('view', { id: encoded });
                localStorage.removeItem('bonNoList');
            })
            .catch(e => {
                this.error = e;
            })
    }
}
