import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { ServiceCore } from './service-core';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service, ServiceCore)
export class Edit {
    constructor(router, service, serviceCore) {
        this.router = router;
        this.service = service;
        this.serviceCore = serviceCore
    }

    isEdit = true;

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
    }

    cancelCallback(event) {
        //this.router.navigateToRoute('view', { id: this.data.Id });
        const encoded = Base64Helper.encode(this.data.Id);
        this.router.navigateToRoute('view', { id: encoded });
    }

    saveCallback(event) {
        console.log(this.data);
        this.service.update(this.data)
            .then(result => {
               // this.router.navigateToRoute('view', { id: this.data.Id });
                const encoded = Base64Helper.encode(this.data.Id);
                this.router.navigateToRoute('view', { id: encoded });
            })
            .catch(e => {
                this.error = e;
            })
    }
}