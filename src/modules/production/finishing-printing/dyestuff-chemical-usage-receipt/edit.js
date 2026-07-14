import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../../utils/base-64-coded-helper';


@inject(Router, Service)
export class EditInput {
    constructor(router, service) {
        this.router = router;
        this.service = service;
        this.returnToCreate = false;
    }

    async activate(params) {
        let id = params.id;
        let decodedId = Base64Helper.decode(id);
        this.returnToCreate = params.returnToCreate === true || params.returnToCreate === 'true';
        this.data = await this.service.getById(decodedId);
    }

    cancelCallback(event) {
        if (this.returnToCreate) {
            this.router.navigateToRoute('create', {}, { replace: true, trigger: true });
        } else {
            const encoded = Base64Helper.encode(this.data.Id);
            this.router.navigateToRoute('view', { id: encoded });
        }
    }

    confirmCheckedCallback(event) {
        const data = [{ op: 'replace', path: '/IsUpdatedAdjustmentData', value: true }];

        this.service.patch(this.data.Id, data)
            .then(() => {
                alert('Data sebelumnya sudah dikonfirmasi. Lanjutkan proses create.');
                this.router.navigateToRoute('create', {}, { replace: true, trigger: true });
            })
            .catch(e => {
                this.error = e;
            });
    }

    saveCallback(event) {
        this.service.update(this.data)
            .then(() => {
                if (this.returnToCreate) {
                    const data = [{ op: 'replace', path: '/IsUpdatedAdjustmentData', value: true }];

                    this.service.patch(this.data.Id, data)
                        .then(() => {
                            alert('Data berhasil diperbarui. Lanjutkan proses create.');
                            this.router.navigateToRoute('create', {}, { replace: true, trigger: true });
                        })
                        .catch(e => {
                            this.error = e;
                        });
                } else {
                    const encoded = Base64Helper.encode(this.data.Id);
                    this.router.navigateToRoute('view', { id: encoded });
                }
            })
            .catch(e => {
                this.error = e;
            })
    }
}