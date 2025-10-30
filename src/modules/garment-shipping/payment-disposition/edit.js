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
        var type = params.type; 
        if(type == "EMKL")
        {
            this.data = await this.service.getByIdEMKL(id);
        }else{
            this.data = await this.service.getById(id);
        }
        this.error = {};
    }

    cancelCallback(event) {
        const encoded = Base64Helper.encode(this.data.id);
        this.router.navigateToRoute('view', { id: encoded,type:this.data.paymentType });
    }

    saveCallback(event) {
        if(this.data.paymentType == 'EMKL'){
            this.service.updateEMKL(this.data)
            .then(result => {
                const encoded = Base64Helper.encode(this.data.id);
                this.router.navigateToRoute('view', { id: encoded,type:this.data.paymentType });
            })
            .catch(e => {
                this.error = e;
            })
        }else{
        this.service.update(this.data)
            .then(result => {
                const encoded = Base64Helper.encode(this.data.id);
                this.router.navigateToRoute('view', { id: encoded,type:this.data.paymentType });
            })
            .catch(e => {
                this.error = e;
            })
        }
    }
}
