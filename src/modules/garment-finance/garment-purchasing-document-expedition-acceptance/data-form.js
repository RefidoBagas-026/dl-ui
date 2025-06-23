import { inject, bindable, BindingEngine, observable, computedFrom } from 'aurelia-framework'
import { Service } from "./service";
var moment = require('moment');

@inject(BindingEngine, Element, Service)
export class DataForm {
    @bindable readOnly = false;
    @bindable data = {};
    @bindable error = {};
    @bindable title;
    @bindable options = {};

    constructor(bindingEngine, element, service) {
        this.bindingEngine = bindingEngine;
        this.element = element;
        this.service = service;
    }
    internNoteRevisionItem = {
        columns: [
            { header: "Nomor PO EKS"},
            { header: "Nomor Refpr" },
            { header: "Nama Barang" },
            { header: "Jumlah (NI)" },
            { header: "Jumlah (PO)" },
            { header: "Satuan" },
            { header: "Harga Satuan" },
            { header: "Harga Total" },
            { header: "Keterangan" },
            { header: "Jumlah OB" },
            { header: "Persentase OB" }
        ],
        onAdd: function () {
            this.context.ItemsCollection.bind();
            this.data.items.push({});
        }.bind(this),
    };

    auInputOptions = {
        label: {
            length: 4,
            align: "right"
        },
        control: {
            length: 5
        }
    };

    bind(context) {
        this.context = context;
        this.data = this.context.data;
        this.error = this.context.error;
        this.options = this.options ? this.options : {};
    }

    @computedFrom("data.Id")
    get isEdit() {
        return (this.data.Id || '').toString() != '';
    }
    
    resetErrorItems() {
        if (this.error) {
            if (this.error.items) {
                this.error.items = [];
            }
        }
    }
}
