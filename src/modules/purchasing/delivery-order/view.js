import {inject, Lazy} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Service} from './service';
import { Dialog } from '../../../au-components/dialog/dialog';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service, Dialog)
export class View {
    hasCancel = true;
    hasEdit = false;
    hasDelete = false;

    constructor(router, service, dialog) {
        this.router = router;
        this.service = service;
        this.dialog = dialog;
    }
    isReceived = false;

    async activate(params) {
        var id = params.id;
        let decoded = Base64Helper.decode(id);
        id = decoded;
        this.data = await this.service.getById(id);
        this.supplier = this.data.supplier;
        // this.isReceived = this.data.items
        //     .map((item) => {
        //         var _isReceived = item.fulfillments
        //             .map((fulfillment) => fulfillment.realizationQuantity.length > 0)
        //             .reduce((prev, curr, index) => {
        //                 return prev || curr
        //             }, false);
        //         return _isReceived
        //     })
        //     .reduce((prev, curr, index) => {
        //         return prev || curr
        //     }, false);

        this.isReceived = this.data.unitReceiptNoteIds && this.data.unitReceiptNoteIds.length > 0;

        if (!this.isReceived) {
            this.hasDelete = true;
            this.hasEdit = true;
        }
    }

    cancel(event) {
        this.router.navigateToRoute('list');
    }

    edit(event) {
        const encoded = Base64Helper.encode(this.data._id);
        if(confirm('Apakah anda ingin merubah data ini?') == true) {
            this.router.navigateToRoute('edit', { id: encoded });
        }
    }

    delete(event) {
        this.dialog.prompt('Apakah anda yakin akan menghapus data ini?', 'Hapus Data Surat Jalan')
        .then(response => {
            if (response.ok) {
                this.service.delete(this.data).then(result => {
                    alert("Data berhasil dihapus");
                    this.cancel();
                });
            }
        })
    }
}
