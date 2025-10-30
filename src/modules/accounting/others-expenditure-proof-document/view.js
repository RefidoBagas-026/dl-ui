import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { ServiceCore } from './service-core';
import { Dialog } from '../../../au-components/dialog/dialog';
import { Base64Helper } from '../../../utils/base-64-coded-helper';
@inject(Router, Service, ServiceCore, Dialog)
export class View {
    constructor(router, service, serviceCore, dialog) {
        this.router = router;
        this.service = service;
        this.serviceCore = serviceCore;
        this.dialog = dialog;
    }

    async activate(params) {
        //let id = params.id;
        const decoded = Base64Helper.decode(params.id);
        let id = decoded;
        await this.service.getById(id)
            .then((result) => {
                this.data = result;

                return this.serviceCore.getBankById(result.AccountBankId)
                    .then((bankResult) => {
                        this.data.AccountBank = bankResult;

                        let itemPromises = this.data.Items.map((item) => {

                            return this.service.getCOAById(item.COAId)
                                .then((coaResult) => {
                                    item.COA = coaResult;
                                    return Promise.resolve(item);
                                });
                        });

                        return Promise.all(itemPromises)
                            .then((items) => {
                                this.data.Items = items;
                                return Promise.resolve();
                            });
                    });
            });

        if (this.data.IsPosted) {
            this.editCallback = undefined;
            this.deleteCallback = undefined;
        }

        // this.data.AccountBank = await
    }

    list() {
        this.router.navigateToRoute('list');
    }

    cancelCallback(event) {
        this.list();
    }

    editCallback(event) {
        //this.router.navigateToRoute('edit', { id: this.data.Id });
        const encoded = Base64Helper.encode(this.data.Id);
        this.router.navigateToRoute('edit', { id: encoded });
    }

    deleteCallback(event) {
        this.dialog.prompt('Apakah anda yakin akan menghapus data ini?', 'Hapus Dokumen')
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
