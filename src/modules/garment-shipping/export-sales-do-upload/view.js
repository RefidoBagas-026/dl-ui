import { inject, Lazy, computedFrom } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class View {
    
    constructor(router, service) {
        this.router = router;
        this.service = service;
         this.editCallback = null;
         this.deleteCallback = null;
    }

    async activate(params) {
        var id = params.id;
        let decoded = Base64Helper.decode(id);
        id = decoded;
        this.data = await this.service.getById(id);
        this.selectedPackingList = this.data.invoiceNo;
        this.setupEdit();
    }

    setupEdit() {
        const canEdit =
            this.data ? (this.data.statusName === "CREATED PACKING LIST" ? false : true) : false;

            console.log(canEdit);
        if (canEdit) {
            // expose editCallback → tombol EDIT muncul
            this.editCallback = () => {
                const encoded = Base64Helper.encode(this.data.id);
                this.router.navigateToRoute('edit', { id: encoded });
            };
            this.deleteCallback = () =>{
                if (confirm("Hapus?")) {
                    this.service.delete(this.data).then(result => {
                        this.cancelCallback();
                    });
                }
            }

        } else {
            // hapus editCallback → tombol EDIT hilang
            this.editCallback = null;
            this.deleteCallback = null;
        }
    }

    cancelCallback(event) {
        this.router.navigateToRoute('list');
    }

    // editCallback(event) {
    //     const encoded = Base64Helper.encode(this.data.id);
    //     this.router.navigateToRoute('edit', { id: encoded });
    // }

    // deleteCallback(event) {
    //     if (confirm("Hapus?")) {
    //         this.service.delete(this.data).then(result => {
    //             this.cancelCallback();
    //         });
    //     }
    // }

}
