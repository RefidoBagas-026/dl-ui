import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { activationStrategy } from 'aurelia-router';

@inject(Router, Service)
export class Create {

    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    bind() {
        this.data = { items: [] };
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
        // Pastikan payload selalu format buyer
         this.data.loaderType = this.data.selectedLoader;
        console.log(this.data);
        if (this.data.selectedLoader === "supplier" && this.data.supplier) {
            this.data.buyer = {
                Id: this.data.supplier.Id,
                Code: this.data.supplier.code,
                Name: this.data.supplier.name
            };
            //this.data.buyer = this.data.supplier;
            delete this.data.supplier;
        }
       
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