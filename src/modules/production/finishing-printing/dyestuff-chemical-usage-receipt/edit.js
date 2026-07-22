import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../../utils/base-64-coded-helper';
import { DataStore } from '../../../../utils/data-store';


@inject(Router, Service, DataStore)
export class EditInput {
    constructor(router, service, dataStore) {
        this.router = router;
        this.service = service;
        this.dataStore = dataStore;
        this.redirectToEdit = false;
    }

    async activate(params) {
        let id = params.id;
        let decodedId = Base64Helper.decode(id);
        this.redirectToEdit = this.dataStore.dataParam.redirectToEdit === true;
        this.data = await this.service.getById(decodedId);

        let mappedData = this.data.UsageReceiptItems.map(item => {
            let mappedDetails = item.UsageReceiptDetails.map(detail => {
                return {
                    ...detail,
                    DyeStuffItems: {
                        Name: detail.Name
                    }
                };
            });
            return {
                ...item,
                UsageReceiptDetails: mappedDetails
            };
        });

        this.data.UsageReceiptItems = mappedData;
    }

    cancelCallback(event) {
        if (this.redirectToEdit) {
            this.router.navigateToRoute('create', {}, { replace: true, trigger: true });
        } else {
            this.dataStore.dataParam.redirectToEdit = false;
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

        this.service.update(this.data)
            .then(() => {
                if (this.redirectToEdit) {
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
                    this.dataStore.dataParam.redirectToEdit = false;
                    const encoded = Base64Helper.encode(this.data.Id);
                    this.router.navigateToRoute('view', { id: encoded });
                }
            })
            .catch(e => {
                this.error = e;
            })
    }
}