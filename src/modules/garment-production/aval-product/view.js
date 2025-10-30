import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import moment from 'moment';
import { Base64Helper } from '../../../utils/base-64-coded-helper';


@inject(Router, Service)
export class View {
    hasCancel = true;
    isView = true;
    hasDelete = true;

    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    async activate(params) {
        var id = params.id;
        var idDecoded = Base64Helper.decode(id);
        this.data = await this.service.getById(idDecoded);
        this.selectedUnit = this.data.Unit;
        for (var a of this.data.Items) {
            a.IsSave = true;
            a.BCDate = moment(a.BCDate).format() == moment(new Date(null)).subtract(7, 'h').format() ? null : a.BCDate;
            if (a.IsReceived) {
                this.hasEdit = false;
                this.hasDelete = false;
            }
        }
    }

    cancel(event) {
        this.router.navigateToRoute('list');
    }

    edit(event) {
        var idEncoded = Base64Helper.encode(this.data.Id);
        this.router.navigateToRoute('edit', { id: idEncoded });
    }

    delete(event) {
        this.service.delete(this.data).then(result => {
            alert(`delete data success`);
            this.cancel();
        });
    }
}
