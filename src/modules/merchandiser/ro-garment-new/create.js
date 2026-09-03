import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';

@inject(Router, Service)
export class Create {

    constructor(router, service) {
        this.router = router;
        this.service = service;
        this.data = {};
        this.error = {};
        this.errItem = [];
    }

    list() {
        this.router.navigateToRoute('list');
    }

    cancelCallback(event) {
        this.list();
    }

    saveCallback() {
        if(this.data.error && this.data.error.length > 0) {
            this.errItem = this.data.error;
            this.error = {};
            this.error['ErrItem'] = this.errItem.join('; ');
            return;
        }
        else{
            this.service.create(this.data)
            .then(result => {
                this.list();
            })
            .catch(e => {
                this.error = e;
            })
        }
        
    }
}