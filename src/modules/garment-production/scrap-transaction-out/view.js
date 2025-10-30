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
        this.hasEdit=true;
        this.hasDelete=true;
        this.hasCancel=true;
        this.isView= true;
        console.log(this.data);
      
    }

    cancel(event) {
        this.router.navigateToRoute('list');
    }
    edit(event) {
        var idEncoded = Base64Helper.encode(this.data.Id);
        this.router.navigateToRoute('edit', { id: idEncoded });
    }
    delete(event) {
        if (confirm(`Hapus ${this.data.TransactionNo}?`))
            this.service.delete(this.data)
                .then(result => {
                    this.cancel();
                })
                .catch(e => {
                    this.error = e;
                })
    }
   
}