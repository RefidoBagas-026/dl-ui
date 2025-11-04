import { bindable, inject, containerless, computedFrom, BindingEngine } from "aurelia-framework";
import { BindingSignaler } from 'aurelia-templating-resources';
import { Service } from "./service";
import CategoryComodityLoader from "../../../loader/garment-category-comodity-loader";


@containerless()
@inject(Service, BindingSignaler, BindingEngine)
export class DataForm {
    @bindable readOnly = false;
    @bindable data = {};
    @bindable title;
    @bindable error = {};
    @bindable CategoryComodity;

    constructor(service, bindingSignaler, bindingEngine) {
        this.service = service;
        this.signaler = bindingSignaler;
        this.bindingEngine = bindingEngine;
    }

    get categoryComodityLoader() {
        return CategoryComodityLoader;
    }
    categoryComodityView = (comodities) => {
        return `${comodities.Code} - ${comodities.Name}`;
    }
    controlOptions = {
        label: {
            length: 4
        },
        control: {
            length: 5
        }
    }

    bind(context) {
        this.context = context;
        this.data = this.context.data;
        this.error = this.context.error;
        if (this.data.CategoryCode && this.data.CategoryName) {
            this.CategoryComodity = {
                Code: this.data.CategoryCode,
                Name: this.data.CategoryName
            };
        }
    }

    CategoryComodityChanged(newValue) {
        if (newValue) {
            this.data.CategoryCode = newValue.Code;
            this.data.CategoryName = newValue.Name;
        } else {
            this.data.CategoryCode = null;
            this.data.CategoryName = null;
        }
    }
}