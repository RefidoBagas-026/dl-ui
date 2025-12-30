import { inject, bindable, computedFrom } from 'aurelia-framework'
import { Service } from "../service";

const UnitLoader = require('../../../../../../loader/garment-units-loader');
var ReceiptAvalLoader = require('../../../../../../loader/garment-leftover-warehouse-aval-receipt-loader');
const UomLoader = require('../../../../../../loader/uom-loader');


@inject(Service)
export class items {
    @bindable selectedUnit;
    @bindable selectedAval;

    get unitLoader() {
        return UnitLoader;
    }


    unitView = (unit) => {
        return `${unit.Code} - ${unit.Name}`;
    }

    get avalLoader() {
        return ReceiptAvalLoader;
    }

    avalView = (aval) => {
        return `${aval.AvalReceiptNo}`
    }


    @computedFrom("data.Unit")
    get filterFabric() {
        var filter = {
            AvalType: this.data.type,
            UnitFromId: (this.data.Unit || {}).Id || 0,
            IsUsed: false
        };
        for (var item of this.context.context.items) {
            filter[`AvalReceiptNo == "${item.data.AvalReceiptNo}"`] = false;
        }
        return filter;
    }

    constructor(service) {
        this.service = service;
        this.kgUom = null; 
    }

    async activate(context) {
        this.context = context;
        this.data = context.data;
        this.error = context.error;
        this.options = context.options;
        this.readOnly = this.options.readOnly;
        this.isCreate = context.context.options.isCreate;
        this.isEdit = context.context.options.isEdit;
        //this.isFabric=this.data.type==="AVAL FABRIC";

        if (this.data) {
            this.selectedUnit = this.data.Unit;
            this.selectedAval = { AvalReceiptNo: this.data.AvalReceiptNo || "" };
        }

        this.uom = "KG";

            try {
                const uoms = await UomLoader("KG", {});
                if (uoms && uoms.length > 0) {
                    this.kgUom = uoms.find(u => u.Unit === "KG");
                    if (this.kgUom) {
                        console.log("KG UOM ID:", this.kgUom.Id);
                        if (this.data && this.data.type === "AVAL KOMPONEN") {
                            this.data.Uom = {
                                Id: this.kgUom.Id,
                                Unit: this.kgUom.Unit
                            };
                        }
                    }
                }
            } catch (error) {
                console.error("Failed to fetch KG UOM:", error);
            }


    }

    selectedAvalChanged(newValue) {
        this.data.AvalReceiptId = 0;
        this.data.AvalReceiptNo = "";
        this.data.Quantity = 0;
        this.data.ActualQuantity = 0;
        if (newValue) {
            this.data.AvalReceiptId = newValue.Id;
            this.data.AvalReceiptNo = newValue.AvalReceiptNo;
            this.data.Quantity = newValue.TotalAval;
            this.data.ActualQuantity = newValue.TotalAval;
           if (this.data.type === "AVAL KOMPONEN") {
                if (this.kgUom) {
                    this.data.Uom = {
                        Id: this.kgUom.Id,
                        Unit: this.kgUom.Unit
                    };
                }
            } else {
                // For other types, keep original Uom from aval
                this.data.Uom = newValue.Items[0].Uom;
            }
        }
    }

    selectedUnitChanged(newValue) {
        this.data.AvalReceiptId = 0;
        this.data.AvalReceiptNo = "";
        this.selectedAval = null;
        this.data.Quantity = 0;
        this.data.ActualQuantity = 0;
        if (newValue)
            this.data.Unit = newValue;
        else {
            this.data.Unit = null;
            this.selectedAval = null;
            this.data.AvalReceiptId = 0;
            this.data.AvalReceiptNo = "";
            this.data.Quantity = 0;
            this.data.ActualQuantity = 0;
        }
    }
}