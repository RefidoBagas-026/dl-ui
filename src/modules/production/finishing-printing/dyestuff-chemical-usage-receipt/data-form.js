import { inject, bindable, computedFrom } from 'aurelia-framework';
import { months } from '../../../../../node_modules/moment/moment';
import { Service } from './service';
import { Router } from 'aurelia-router';
let ProductionOrderLoader = require("../../../../loader/production-order-loader");
let StrikeOffLoader = require("../../../../loader/strike-off-usage-loader");
var moment = require('moment');

@inject(Router, Service)
export class DataForm {
    partialNumber = 0;
    @bindable title;
    @bindable readOnly;
    @bindable enableConfirmChecked;

    // itemYears = [];

    formOptions = {
        cancelText: "Kembali",
        saveText: "Simpan",
        deleteText: "Hapus",
        editText: "Ubah",
    };

    controlOptions = {
        label: {
            length: 4,
        },
        control: {
            length: 4,
        },
    };

    controlOptionsTotal = {
        label: {
            length: 6,
        },
        control: {
            length: 6,
        },
    };

    sppQuery = {
        OrderTypeName: 'PRINTING'
    };

    get productionOrderLoader() {
        return ProductionOrderLoader;
    }


    get strikeOffLoader() {
        return StrikeOffLoader;
    }

    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    @computedFrom("data.Id")
    get isEdit() {
        return (this.data.Id || '').toString() != '';
    }

    bind(context) {
        this.context = context;
        this.data = this.context.data;
        this.error = this.context.error;

        this.cancelCallback = this.context.cancelCallback;
        this.deleteCallback = this.context.deleteCallback;
        this.editCallback = this.context.editCallback;
        this.saveCallback = this.context.saveCallback;
        this.confirmCheckedCallback = this.context.confirmCheckedCallback;

        if (this.data.StrikeOff) {
            this.selectedStrikeOff = this.data.StrikeOff;
        }

        if (this.data.ProductionOrder) {
            this.selectedProductionOrder = this.data.ProductionOrder;
        }
    }

    getLatestNonZeroQuantity(prevDetail) {
        const quantities = [
            prevDetail.ReceiptQuantity,
            prevDetail.Adjs1Quantity,
            prevDetail.Adjs2Quantity,
            prevDetail.Adjs3Quantity,
            prevDetail.Adjs4Quantity,
            prevDetail.Adjs5Quantity,
            prevDetail.Adjs6Quantity
        ];

        let latestNonZero = 0;
        for (const quantity of quantities) {
            const value = Number(quantity) || 0;
            if (value !== 0) {
                latestNonZero = value;
            }
        }

        return latestNonZero;
    }

    confirmCheckedData() {
        if (this.confirmCheckedCallback && typeof this.confirmCheckedCallback === 'function') {
            this.confirmCheckedCallback({ event: null });
        }
    }

    construction = "";
    @bindable selectedProductionOrder;
    async selectedProductionOrderChanged(n, o) {
        if (this.selectedProductionOrder) {
            this.data.ProductionOrder = this.selectedProductionOrder;
            this.construction = `${this.selectedProductionOrder.Material.Name} / ${this.selectedProductionOrder.MaterialConstruction.Name} / ${this.selectedProductionOrder.MaterialWidth}`;
            // Ambil partial number
            try {
                const result = await this.service.getPartial(this.data.ProductionOrder.Id);
                this.partialNumber = result && result.Data ? result.Data : 0;
            } catch (e) {
                this.partialNumber = 0;
            }
        } else {
            this.partialNumber = 0;
        }
        this.partialNumber = this.isEdit ? this.data.NumberOfPartial : this.partialNumber;
        console.log(this.isEdit);
        this.textPartial = this.partialNumber > 0 ? `Partial ${this.partialNumber}` : "";
        this.data.NumberOfPartial = this.partialNumber;

    }
    @bindable selectedStrikeOff;
    async selectedStrikeOffChanged(n, o) {
        if (this.selectedStrikeOff) {
            this.data.StrikeOff = this.selectedStrikeOff;
            var prevResult = await this.service.getPrevData(this.data.StrikeOff.Id);
            var prevData = prevResult.Data;
            this.data.RepeatedProductionOrderNo = prevResult.OrderNo;

            if (this.context && typeof this.context.onPreviousAdjustmentPending === 'function') {
                this.context.onPreviousAdjustmentPending({
                    hasPendingAdjustment: !!(prevData && prevData.IsUpdatedAdjustmentData === false),
                    prevDataId: prevData ? prevData.Id : null,
                    repeatedProductionOrderNo: prevData ? prevData.ProductionOrder.OrderNo : null
                });
            }

            if (!this.data.Id) {
                this.data.UsageReceiptItems = [];
                for (var item of this.data.StrikeOff.StrikeOffItems) {
                    var usageReceipt = {};
                    usageReceipt.ColorCode = item.ColorCode;
                    usageReceipt.UsageReceiptDetails = [];
                    var idx = 0;

                    // If data is found or repeat order
                    if (prevData) {
                        var prevUsageReceipt = prevData.UsageReceiptItems.find(s => s.ColorCode == item.ColorCode);
                        for (var detail of item.StrikeOffItemDetails) {
                            var prevDetail = null;
                            if (prevUsageReceipt) {
                                prevDetail = prevUsageReceipt.UsageReceiptDetails.find(s => s.Name == detail.Name);
                            }

                            var usageDetail = {};
                            usageDetail.Index = idx++;
                            usageDetail.Name = detail.Name;
                            if (prevDetail) {
                                const latestNonZeroQuantity = this.getLatestNonZeroQuantity(prevDetail);
                                usageDetail.ReceiptQuantity = latestNonZeroQuantity !== 0 ? latestNonZeroQuantity : detail.Quantity;
                            } else {
                                usageDetail.ReceiptQuantity = detail.Quantity;
                            }

                            usageReceipt.UsageReceiptDetails.push(usageDetail);
                        }
                        this.data.UsageReceiptItems.push(usageReceipt);
                    }
                    // If data is not found or not repeat order
                    else {
                        for (var detail of item.StrikeOffItemDetails) {
                            var usageDetail = {};
                            usageDetail.Index = idx++;
                            usageDetail.Name = detail.Name;
                            usageDetail.ReceiptQuantity = detail.Quantity;

                            usageReceipt.UsageReceiptDetails.push(usageDetail);
                        }
                        this.data.UsageReceiptItems.push(usageReceipt);
                    }
                }
            }
        }
    }
}