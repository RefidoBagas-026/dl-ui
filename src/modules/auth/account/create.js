import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { PasswordValidator } from '../../../utils/password-validator';

@inject(Router, Service)
export class Create {
    constructor(router, service) {
        this.router = router;
        this.service = service;
        this.data = { profile: {}, roles: [] };
        this.error = { profile: {}, roles: [] };
    }

    activate(params) {

    }

    list() {
        this.router.navigateToRoute('list');
    }

    save() {
        var validate = PasswordValidator.validate(this.data.password);

        if (validate == null) {
            this.service.create(this.data)
                .then(result => {
                    this.list();
                })
                .catch(e => {
                    this.error = e;
                })
        } else {
            alert(validate);
        }
    }
}
