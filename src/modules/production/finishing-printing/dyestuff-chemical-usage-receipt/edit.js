import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';


@inject(Router, Service)
export class EditInput {
    constructor(router, service) {
        this.router = router;
        this.service = service;
        this.returnToCreate = false;
    }

    async activate(params) {
        let id = params.id;
        this.returnToCreate = params.returnToCreate === true || params.returnToCreate === 'true';
        this.data = await this.service.getById(id);
    }

    cancelCallback(event) {
        if (this.returnToCreate) {
            this.router.navigateToRoute('create', {}, { replace: true, trigger: true });
        } else {
            this.router.navigateToRoute('view', { id: this.data.Id });
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
                    this.router.navigateToRoute('view', { id: this.data.Id });
                }
            })
            .catch(e => {
                this.error = e;
            })
    }
}