import {inject, Lazy} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Service} from './service';
import {Base64Helper} from '../../../utils/base-64-coded-helper';


@inject(Router, Service)
export class View {
    isView = true;
    isPosted = true;
    isUnposted = true;

    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    async activate(params) {
        var id = params.id;
        let decoded = Base64Helper.decode(id);
        id = decoded;
        this.data = await this.service.getById(id);
        // if(this.data.IsPosted==true){
        //     if(this.data.IsCC || this.data.IsPR){
        //         this.isUnposted = false;
        //     } else {
        //         this.isUnposted = true;
        //     }
        // } else {
        //     this.isUnposted = false;
        // }
        // this.isUnposted = this.data.IsPosted && (!this.data.IsCC && !this.data.IsPR);
        // if (this.data.IsPosted) {
        //     this.isPosted = this.data.I;
        // }
        this.isPosted = this.data.IsPosted;
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

    unpost(data) {
        const encoded = Base64Helper.encode(this.data.Id);
        if (confirm(`Unpost Data?`))
            this.service.unpost({ Id: encoded })
                .then(result => {
                    this.list();
                });
    }
}