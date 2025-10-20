import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { activationStrategy } from 'aurelia-router';
import moment from 'moment';

@inject(Router, Service)
export class Create {
    isCreate = true;
    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    bind() {
        this.data = { Items: [] };
        this.error = {};
    }

    determineActivationStrategy() {
        return activationStrategy.replace; //replace the viewmodel with a new instance
        // or activationStrategy.invokeLifecycle to invoke router lifecycle methods on the existing VM
        // or activationStrategy.noChange to explicitly use the default behavior
        // return activationStrategy.invokeLifecycle;
    }

    cancelCallback(event) {
        this.router.navigateToRoute('list');
    }

    saveCallback(event) {
        this.data.FinishingInDate=null;
        if(this.data && this.data.IsDifferentSize){
            if(this.data.Items){
                for(var item of this.data.Items){
                    item.IsSave=item.Details.length>0;
                    if(item.IsSave){
                        if(this.data.FinishingInDate==null || this.data.FinishingInDate<item.FinishingInDate)
                            this.data.FinishingInDate=item.FinishingInDate;
                        item.TotalQuantity=0;
                        for(var detail of item.Details){
                            item.TotalQuantity += detail.Quantity;
                            detail.Uom=item.Uom;
                        }
                        item.RemainingQuantity=item.TotalQuantity;
                        item.Price=(item.BasicPrice + (item.ComodityPrice * 50/100)) * item.RemainingQuantity;
                        
                    }
                }
            }
        }
        if(this.data&& !this.data.IsDifferentSize){
            if(this.data.Items){
                for(var item of this.data.Items){
                    item.IsSave=item.Quantity>0;
                    if(item.IsSave){
                        if(this.data.FinishingInDate==null || this.data.FinishingInDate<item.FinishingInDate)
                            this.data.FinishingInDate=item.FinishingInDate;
                        item.RemainingQuantity=item.Quantity;
                        item.Price=(item.BasicPrice + (item.ComodityPrice * 50/100)) * item.Quantity;
                    }
                }
            }
        }
        this.data.FinishingOutDate = this.data.FinishingOutDate ? moment.utc(this.data.FinishingOutDate).local().format() : null;
        this.service.create(this.data)
            .then(result => {
                alert("Data berhasil dibuat");
                this.router.navigateToRoute('create', {}, { replace: true, trigger: true });
            })
            .catch(e => {
                let apiError = null;

                if (e) {
                    apiError = e;
                } else if (e.response && e.response.data && e.response.data.error) {
                    apiError = e.response.data.error;
                } else if (e.Errors) {
                    apiError = e.Errors;
                }else if (typeof e === "object") {
                    apiError = e;
                }

                if (apiError) {
                    this.error = this.parseError(apiError);
                } else if (typeof e === "string") {
                    alert(e);
                } else {
                    alert("Missing Some Data");
                }
            })
    }
    parseError(apiError) {
        const parsed = {};

        for (let key in apiError) {
            const message = apiError[key];

            // Pisahkan key seperti "Items[0].Details[1].Size" -> ["Items", "0", "Details", "1", "Size"]
            const parts = key.split(/[\[\]\.]+/).filter(p => p);

            let current = parsed;
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                const nextPart = parts[i + 1];
                const isLast = i === parts.length - 1;

                if (isLast) {
                    // assign pesan error di level terakhir
                    current[part] = message;
                } else {
                    // jika belum ada, buat array atau object tergantung nextPart
                    if (!current[part]) {
                        current[part] = isNaN(nextPart) ? {} : [];
                    }
                    current = current[part];
                }
            }
        }

        return parsed;
    }
}