import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class Edit {
    isEdit = true;

    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    async activate(params) {
        let id = params.id;
        let decoded = Base64Helper.decode(id);
        id = decoded;
        this.data = await this.service.getById(id);
        this.data.UnitDONo = this.data.UnitDONo ? this.data.UnitDONo : "";
    }

    bind() {
        this.error = {};
    }

    cancelCallback(event) {
        const encoded = Base64Helper.encode(this.data.Id);
        this.router.navigateToRoute('view', { id: encoded });
    }

    saveCallback(event) {
        // let objData = {};
        // let data = Object.assign(objData, this.data)
        // data.Items = data.Items.filter(x => x.IsSave==true);
        this.service.update(this.data)
            .then(result => {
                this.cancelCallback();
            })
            .catch(e => {
                this.error = e;
                if (typeof (this.error) == "string") {
                    alert(this.error);
                } else {
                    alert("Missing Some Data");
                }
            })
    }
}