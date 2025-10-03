import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';
import { PasswordValidator } from '../../../utils/password-validator';

@inject(Router, Service)
export class Edit {
    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    async activate(params) {
        const decoded = Base64Helper.decode(params.id);
        var id = decoded;
        this.data = await this.service.getById(id);
        this.data.password = "";
    }

    view() {
        const encoded = Base64Helper.encode(this.data._id);
        this.router.navigateToRoute('view', { id: encoded });
    }

    save() {
        var validate = this.data.password !== "" ? PasswordValidator.validate(this.data.password) : null;

        if (validate == null) {
            this.service.update(this.data)
                .then(result => {
                    this.view();
                })
                .catch(e => {
                    this.error = e;
                })
        } else {
            alert(validate);
        }
    }
}
