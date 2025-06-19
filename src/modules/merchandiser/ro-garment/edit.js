import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';

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
        this.data = await this.service.getById(id);
    }

    cancelCallback(event) {
        this.router.navigateToRoute('view', { id: this.data.Id });
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
                    this.router.navigateToRoute('view', { id: this.data.Id });
                })
                .catch(e => {
                    this.error = e;
                })
        }
    }
}