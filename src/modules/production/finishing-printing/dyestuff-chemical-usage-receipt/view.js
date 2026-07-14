import {inject, Lazy} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Service} from './service';
import { Dialog } from '../../../../au-components/dialog/dialog';
import { Base64Helper } from '../../../../utils/base-64-coded-helper';

@inject(Router, Service, Dialog)
export class View {
    constructor(router, service, dialog) {
        this.router = router;
        this.service = service;
        this.dialog = dialog;
    }

    async activate(params) {
        let id = params.id;
        let decodedId = Base64Helper.decode(id);
        this.data = await this.service.getById(decodedId);
        console.log(this.data.NumberOfPartial);
        

    }

    list() {
        this.router.navigateToRoute('list');
    }

    cancelCallback(event) {
        this.list();
    }

    editCallback(event) {
        const encodedId = Base64Helper.encode(this.data.Id);
        this.router.navigateToRoute('edit', { id: encodedId });
    }

    deleteCallback(event) {
        this.dialog.prompt('Apakah anda yakin mau menghapus data ini?', 'Hapus Data Step')
            .then(response => {
                if (response.ok) {
                    this.service.delete(this.data)
                        .then(result => {
                            this.list();
                        });
                }
            });
    }
}
