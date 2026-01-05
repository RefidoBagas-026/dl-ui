import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { activationStrategy } from 'aurelia-router';

@inject(Router, Service)
export class Create {

    constructor(router, service) {
        this.router = router;
        this.service = service;
        this.isCreate = true;
    }

    bind() {
        this.data = { Items: [] };
        this.error = {};
    }

    determineActivationStrategy() {
        return activationStrategy.replace; //replace the viewmodel with a new instance
        // or activationStrategy.invokeLifecycle to invoke router lifecycle methods on the existing VM
        // or activationStrategy.noChange to explicitly use the default behavior
    }

    cancelCallback(event) {
        this.router.navigateToRoute('list');
    }

    saveCallback(event) {
        // console.log(this.error.Items);

        // const hasItemError =
        //     Array.isArray(this.error.Items) &&
        //     this.error.Items.some(item =>
        //         item &&
        //         Object.values(item).some(v =>
        //             v !== undefined &&
        //             v !== null &&
        //             !(typeof v === "string" &19& v.trim() === "")
        //         )
        //     );

        // if (hasItemError) {
        //     alert("Data tidak dapat disimpan, mohon periksa kembali data item anda");
        //     return;
        // }

        this.service.create(this.data)
            .then(result => {
                alert("Data berhasil dibuat");
                this.router.navigateToRoute('create', {}, { replace: true, trigger: true });
            })
            .catch(error => {
                this.error = error;
            });
    }
}