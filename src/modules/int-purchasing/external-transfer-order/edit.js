import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import moment from 'moment';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class Edit {
    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    async activate(params) {
        let id = params.id;
        let decoded = Base64Helper.decode(id);
        id = decoded;
        this.data = await this.service.getById(id);
        this.data.DeliveryDate = moment(this.data.DeliveryDate).format("DD MMM YYYY HH:mm");
        this.data.OrderDate = moment(this.data.OrderDate).format("DD MMM YYYY HH:mm");
    }

    bind() {
        this.error = {};
    }

    cancelCallback(event) {
        const encoded = Base64Helper.encode(this.data.id);
        this.router.navigateToRoute('view', { id: encoded });
    }

    saveCallback(event) {
        this.data.DeliveryDate = moment(this.data.DeliveryDate).format("DD MMM YYYY HH:mm");
        this.data.OrderDate = moment(this.data.OrderDate).format("DD MMM YYYY HH:mm");
        this.service.update(this.data)
            .then(result => {
                this.cancelCallback();
            })
            .catch(e => {
                this.error = e;
            })
    }
}
