import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';


@inject(Router, Service)
export class View {
    
    constructor(router, service) {
        this.router = router;
        this.service = service;
        this.hasCancel = true;
        this.hasEdit = false;
        this.hasDelete = false;
    }

    async activate(params) {
        var id = params.id;
        this.data = await this.service.getById(id);
    }

    cancel(event) {
        this.router.navigateToRoute('list');
    }

    edit(event) {
        var r = confirm("Apakah anda yakin akan mengubah data ini?")
        if (r == true) {
            this.router.navigateToRoute('edit', { id: this.data.Id });
        }
    }

    delete(event) {
        var r = confirm("Apakah anda yakin akan menghapus data ini?")
        if (r == true) {
            this.service.delete(this.data).then(result => {
                this.cancel();
            });
        }
    }
}
