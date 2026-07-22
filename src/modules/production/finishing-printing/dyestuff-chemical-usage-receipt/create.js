import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { activationStrategy } from 'aurelia-router';
import { Dialog } from '../../../../au-components/dialog/dialog';
import { Base64Helper } from '../../../../utils/base-64-coded-helper';
import { DataStore } from '../../../../utils/data-store';


@inject(Router, Service, Dialog, DataStore)
export class Create {
    constructor(router, service, dialog, dataStore) {
        this.router = router;
        this.service = service;
        this.dialog = dialog;
        this.dataStore = dataStore;
        this.data = {};
        this.pendingPreviousAdjustment = null;
    }

    activate() {
        var dataParam = this.dataStore.dataParam;
        this.data = dataParam && dataParam.redirectToEdit === true ? { ...dataParam.data } : {};
        this.pendingPreviousAdjustment = null;
    }

    list() {
        this.router.navigateToRoute('list');
    }

    determineActivationStrategy() {
        return activationStrategy.replace;
    }

    cancelCallback(event) {
        this.dataStore.dataParam = {};
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
                    this.dataStore.dataParam.redirectToEdit = true;
                    this.dataStore.dataParam.data = this.data;
                    this.router.navigateToRoute('edit', { id: pendingId });
                }
            });
            return;
        }

        let mappedData = this.data.UsageReceiptItems.map(item => {
            let mappedDetails = item.UsageReceiptDetails.map(detail => {
                return {
                    Index: detail.Index,
                    DyeStuffItems: {
                        Name: detail.DyeStuffItems.Name
                    },
                    Name: detail.DyeStuffItems.Name,
                    ReceiptQuantity: detail.ReceiptQuantity
                };
            });

            return {
                ColorCode: item.ColorCode,
                Wide: item.Wide,
                TotalRealizationQty: item.TotalRealizationQty,
                UsageReceiptDetails: mappedDetails
            };
        });

        this.data.UsageReceiptItems = mappedData;

        this.service.create(this.data)
            .then(result => {
                this.dataStore.dataParam = {};
                alert('Data berhasil dibuat');
                this.router.navigateToRoute('create', {}, { replace: true, trigger: true });
            })
            .catch(e => {
                this.error = e;
            });
    }
}
