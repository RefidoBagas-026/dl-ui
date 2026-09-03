import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class Edit {
    
    constructor(router, service) {
        this.router = router;
        this.service = service;
        this.data = {};
        this.error = {};
    }

    async activate(params) {
        var id = params.id;
        let decoded = Base64Helper.decode(id);
        id = decoded;
        this.data = await this.service.getById(id);
    }

    cancelCallback(event) {
        const encoded = Base64Helper.encode(this.data.Id);
        this.router.navigateToRoute('view', { id: encoded });
    }

    saveCallback(event) {
        if(this.data.error && this.data.error.length > 0) {
            this.errItem = this.data.error;
            this.error = {};
            this.error['ErrItem'] = this.errItem.join('; ');
            return;
        }
        else{
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