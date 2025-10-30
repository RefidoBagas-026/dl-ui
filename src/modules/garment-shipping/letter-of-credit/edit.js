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
        
        this.tempDocNo=this.data.documentCreditNo;
        this.error = {};
    }

    cancelCallback(event) {
        const encoded = Base64Helper.encode(this.data.id);
        this.router.navigateToRoute('view', { id: encoded });
    }

    async saveCallback(event) {
        this.data.available=false;
        if(this.data.documentCreditNo!= this.tempDocNo){
            var available = await this.service.search({size: 1, filter: JSON.stringify({ DocumentCreditNo: this.data.documentCreditNo })});
        
            this.data.available= available.data.length>0;
        }
        this.service.update(this.data)
            .then(result => {
                const encoded = Base64Helper.encode(this.data.id);
                this.router.navigateToRoute('view', { id: encoded });
            })
            .catch(e => {
                this.error = e;
            })
    }
}
