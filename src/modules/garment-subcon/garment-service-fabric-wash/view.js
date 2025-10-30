import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class View {
    isView = true;
    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    async activate(params) {
        let id = params.id;
        let decoded = Base64Helper.decode(id);
        id = decoded;
        this.data = await this.service.read(id);
        console.log(this.data);
        if (this.data) {
            if(this.data.IsUsed){
                this.deleteCallback=null;
                this.editCallback=null;
            }
        }
    }

    cancelCallback(event) {
        this.router.navigateToRoute('list');
    }

    deleteCallback(event) {
        if (confirm(`Hapus ${this.data.ServiceSubconFabricWashNo}?`))
            this.service.delete(this.data)
                .then(result => {
                    this.cancelCallback();
                })
                .catch(e => {
                    this.error = e;
                    if (typeof (this.error) == "string") {
                        alert(this.error);
                    } else {
                        alert("Missing Some Data");
                    }
                })
    }
    editCallback(event) {
        const encoded = Base64Helper.encode(this.data.Id);
        this.router.navigateToRoute('edit', { id: encoded });
    }

}