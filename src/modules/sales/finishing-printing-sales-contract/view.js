import {inject, Lazy} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Service} from './service';
import {Base64Helper} from '../../../utils/base-64-coded-helper';


@inject(Router, Service)
export class View {
    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    async activate(params) {
        var id = params.id;
        let decoded = Base64Helper.decode(id);
        id = decoded;
        this.data = await this.service.getById(id);
        //this.spp = await this.service.getSPPbySC(this.data.salesContractNo);
        this.canEdit=true;
        if(this.data.referenceNumber && this.data.referenceNumber!=""){
            this.data.reference={orderNo:this.data.referenceNumber};
        }
        else{
            this.data.reference={};
        }
        // console.log(this.data.remainingQuantity);
        if(this.spp){
            this.canEdit=false;
            
        }

    }

    list() {
        this.router.navigateToRoute('list');
    }

    edit(data) {
        const encoded = Base64Helper.encode(this.data.Id);
        this.router.navigateToRoute('edit', { id: encoded });
    }

    delete() {
        this.service.delete(this.data)
            .then(result => {
                this.list();
            });
    }
}