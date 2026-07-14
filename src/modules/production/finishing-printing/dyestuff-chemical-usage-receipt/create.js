import {inject, Lazy} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Service} from './service';
import { activationStrategy } from 'aurelia-router';
import { Dialog } from '../../../../au-components/dialog/dialog';
import { Base64Helper } from '../../../../utils/base-64-coded-helper';


@inject(Router, Service, Dialog)
export class Create {
    constructor(router, service, dialog) {
        this.router = router;
        this.service = service;
        this.dialog = dialog;
        this.data = {};
        this.pendingPreviousAdjustment = null;
    }

    async activate(params) {
        this.data = {};
        this.pendingPreviousAdjustment = null;
    }

    list() {
        this.router.navigateToRoute('list');
    }

    determineActivationStrategy() {
        return activationStrategy.replace;
    }

    cancelCallback(event) {
        this.list();
    }

    onPreviousAdjustmentPending(info) {
        if (info && info.hasPendingAdjustment) {
            this.pendingPreviousAdjustment = {
                prevDataId: info.prevDataId,
                repeatedProductionOrderNo: info.repeatedProductionOrderNo
            };
        } else {
            this.pendingPreviousAdjustment = null;
        }
    }

    saveCallback(event) {
        if (this.pendingPreviousAdjustment && this.pendingPreviousAdjustment.prevDataId) {
            const pendingId = Base64Helper.encode(this.pendingPreviousAdjustment.prevDataId);
            const repeatedNo = this.pendingPreviousAdjustment.repeatedProductionOrderNo || '-';
            this.dialog.prompt(
                `Data repeat order ${repeatedNo} belum dikonfirmasi update revisi. Silakan cek data sebelumnya terlebih dahulu.`,
                'Update Data Sebelumnya Diperlukan'
            ).then(response => {
                if (response.ok) {
                    this.router.navigateToRoute('edit', {
                        id: pendingId,
                        returnToCreate: true
                    });
                }
            });
            return;
        }

        this.service.create(this.data)
            .then(result => {
                alert('Data berhasil dibuat');
                this.router.navigateToRoute('create', {}, { replace: true, trigger: true });
            })
            .catch(e => {
                this.error = e;
            });
    }
}
