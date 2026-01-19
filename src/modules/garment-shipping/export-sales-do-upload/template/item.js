import { inject, bindable, computedFrom } from 'aurelia-framework'
import { Service } from "../service";

@inject(Service)
export class items {
    
    constructor(service) {
        this.service = service;
    }
    async activate(context) {
        this.context = context;
        this.data = context.data;
        this.error = context.error;
        this.options = context.options;
        this.readOnly = this.options.readOnly;
        this.isCreate = context.context.options.isCreate;
        this.isEdit = context.context.options.isEdit;
    }

    @computedFrom("data.BuyerBrand")
    get buyerView() {
        var buyerName = "";
        if(this.data.BuyerBrand){
            if(this.data.BuyerBrand.Code && this.data.BuyerBrand.Name){
                buyerName = `${this.data.BuyerBrand.Code} - ${this.data.BuyerBrand.Name}`;
                return `${buyerName}`;
            }
            else{
                buyerName = `${this.data.BuyerBrand.code} - ${this.data.BuyerBrand.name}`;
                return `${buyerName}`;
            }
        }
        return `${buyerName}`;
    }
}