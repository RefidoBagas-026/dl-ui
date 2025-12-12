import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';


@inject(Router, Service)
export class Edit {
    hasCancel = true;
    hasSave = true;
    ItemsData = [];
    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    bind() {
        this.error = {};
    }

    async activate(params) {
        var id = params.id;
        let decoded = Base64Helper.decode(id);
        id = decoded;
        this.data = await this.service.getById(id);
        this.dataUnitDO=await this.service.getUnitDOId(this.data.UnitDOId);
        this.data.RoJob=this.dataUnitDO.RONo;
        this.unitDeliveryOrder = { UnitDONo:this.data.UnitDONo};
        this.data.Storage.toString = function () {
            return [this.code, this.name]
                .filter((item, index) => {
                    return item && item.toString().trim().length > 0;
                }).join(" - ");
        }

        this.data.StorageRequest.toString = function () {
            return [this.code, this.name]
                .filter((item, index) => {
                    return item && item.toString().trim().length > 0;
                }).join(" - ");
        }

        this.data.UnitRequest.toString = function () {
            return [this.Code, this.Name]
                .filter((item, index) => {
                    return item && item.toString().trim().length > 0;
                }).join(" - ");
        }

        this.data.UnitSender.toString = function () {
            return [this.Code, this.Name]
                .filter((item, index) => {
                    return item && item.toString().trim().length > 0;
                }).join(" - ");
        }

        if (this.data.Items) {
            for (let item of this.data.Items) {
                item.IsSave = true;
                item.IsDisabled = false;
            }
        }

    }

    cancel(event) {
        const encoded = Base64Helper.encode(this.data.Id);
        this.router.navigateToRoute('view', { id: encoded });
    }

    flattenDetailsToItems() {

        const newItems = [];

        for (const item of this.data.Items) {
            if (Array.isArray(item.Details) && item.Details.length > 0) {
            for (const detail of item.Details) {
                newItems.push({
                Id: detail.Id,
                UId: detail.UId,
                UENId: detail.UENId,
                UnitDOItemId: detail.UnitDOItemId,
                URNItemId: detail.URNItemId,
                DODetailId: detail.DODetailId,
                POItemId: detail.POItemId,
                EPOItemId: detail.EPOItemId,
                PRItemId: detail.PRItemId,
                DOItemId : detail.DOItemId,
                RONo: detail.RONo,
                POSerialNumber: detail.POSerialNumber,
                ProductId: detail.ProductId,
                ProductCode: detail.ProductCode,
                ProductName: detail.ProductName,
                ProductRemark: detail.ProductRemark,
                UomId: detail.UomId,
                UomUnit: detail.UomUnit,
                PricePerDealUnit: detail.PricePerDealUnit,
                Quantity: detail.Quantity,
                OldQuantity: detail.OldQuantity !== undefined && detail.OldQuantity !== null
                        ? detail.OldQuantity
                        : detail.Quantity,

                BuyerId: detail.BuyerId,
                BuyerCode: detail.BuyerCode,
                DesignColor: detail.DesignColor,
                FabricType: detail.FabricType,
                DOCurrencyRate: detail.DOCurrencyRate,
                Conversion: detail.Conversion,
                Rack: detail.Rack,
                Level: detail.Level,
                Box: detail.Box,
                Colour: detail.Colour,
                Area: detail.Area,
                IsSave: detail.IsSave,
                IsDisabled: detail.IsDisabled
                });
            }
            } else {
            newItems.push(item);
            }
        }
        this.ItemsData = [];
        this.ItemsData.push(this.data.Items);
        this.data.Items = newItems;
        }

    validateItems() {
        this.error = {};
        let isValid = true;
        
        if (Array.isArray(this.data.Items)) {
            this.error.Items = this.data.Items.map((item, index) => {
                const itemError = {};

                if (item.IsSave && (!Array.isArray(item.Details) || item.Details.length === 0)) {
                    isValid = false;
                    itemError.DetailsCount = "Detail Mohon Diisi";
                }
                if (item.IsSave && Array.isArray(item.Details) && item.Details.length > 0) {
                    itemError.Details = item.Details.map((detail, detailIndex) => {
                        const detailError = {};

                        if (!detail.selectedDOItem && !detail.DOItemId) {
                            isValid = false;
                            detailError.UnitDONo = "No Ref PO Mohon Diisi";
                        }

                        if (!detail.Quantity || detail.Quantity <= 0) {
                            isValid = false;
                            detailError.Quantity = "Jumlah Mohon Diisi";
                        }
                        
                        return detailError;
                    });
                }
                
                return itemError;
            });
        }
        
        return isValid;
    }

    save(event) {
        if (!this.validateItems()) {
            return;
        }
        this.flattenDetailsToItems();   
        this.service.update(this.data).then(result => {
            this.cancel();
        }).catch(e => {
            this.data.Items = this.ItemsData[0];
            
            if (e.statusCode === 500) {
                alert("Gagal menyimpan, silakan coba lagi!");
                return;
            }
            this.error = e;

            if (Array.isArray(this.error.Items) && Array.isArray(this.data.Items)) {
                let flatErrorIndex = 0;
                this.error.Items = this.data.Items.map((item, itemIndex) => {
                    const detailsCount = (Array.isArray(item.Details) && item.Details.length > 0) 
                        ? item.Details.length 
                        : 1;
                    
                    const detailsErrors = [];
                    for (let i = 0; i < detailsCount; i++) {
                        if (flatErrorIndex < e.Items.length) {
                            detailsErrors.push(e.Items[flatErrorIndex]);
                            flatErrorIndex++;
                        } else {
                            detailsErrors.push({});
                        }
                    }
                    return {
                        Details: detailsErrors
                    };
                });
            }
        })
    }
}

