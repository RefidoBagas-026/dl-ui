import { bindable, inject, containerless, computedFrom, BindingEngine } from "aurelia-framework";
import { BindingSignaler } from 'aurelia-templating-resources';
import { Service } from "./service";

@containerless()
@inject(Service, BindingSignaler, BindingEngine)
export class DataForm {
    @bindable readOnly = false;
    @bindable data = {};
    @bindable title;
    @bindable error = {};
    @bindable selectedTarif;

    constructor(service, bindingSignaler, bindingEngine) {
        this.service = service;
        this.signaler = bindingSignaler;
        this.bindingEngine = bindingEngine;
    }
    tarifOptions = [
            { text: "-- Pilih Tarif --", value: "" },
            { text: "Beban Penjualan", value: "Beban Penjualan" },
            { text: "Beban Umum dan Administrasi", value: "Beban Umum dan Administrasi" },
            { text: "Beban (Pendapatan) Diluar Usaha", value: "Beban (Pendapatan) Diluar Usaha" },
        ];
    controlOptions = {
        label: {
            length: 4,
        },
        control: {
            length: '5 text-right',
        },
    }

    bind(context) {
        this.context = context;
        this.data = this.context.data;
        this.error = this.context.error;
        if (this.data && this.tarifOptions && this.tarifOptions.length) {
            var name = this.data.Name || "";

            var match = this.tarifOptions.find(function (option) {
                return option.value === name;
            });

            this.selectedTarif = match ? match.value : null;

            console.log(this.selectedTarif);
        } else {
            this.selectedTarif = null;
        }
    }

    selectedTarifChanged(newValue, oldValue) {
        if (newValue) {
            this.data.Name = newValue.value;
        } else {
            this.data.Name = "";
        }
    }
}