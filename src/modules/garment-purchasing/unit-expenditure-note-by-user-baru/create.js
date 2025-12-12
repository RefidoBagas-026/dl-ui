import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Service} from './service';
import {activationStrategy} from 'aurelia-router';

@inject(Router, Service)
export class Create {
    hasCancel = true;
    hasSave = true;
    ItemsData = [];
    
    constructor(router, service) {
        this.router = router;
        this.service = service;
        this.data = {};
    }
    activate(params) {

    }
    bind() {
        this.data = { Items: [] };
        this.error = {};
    }

    cancel(event) {
        this.router.navigateToRoute('list');
    }

    determineActivationStrategy() {
        return activationStrategy.replace; 
    }

    flattenDetailsToItems() {

        let newItems = [];

        for (const item of this.data.Items) {
            if (Array.isArray(item.Details) && item.Details.length > 0) {
                for (const detail of item.Details) {
                    newItems.push({
                        UnitDOItemId: detail.UnitDOItemId,
                        URNItemId: detail.URNItemId,
                        DODetailId: detail.DODetailId,
                        POItemId: detail.POItemId,
                        EPOItemId: detail.EPOItemId,
                        PRItemId: detail.PRItemId,
                        DOItemId : detail.DOItemId,
                        RONo: detail.RONo,
                        ProductId: detail.ProductId,
                        ProductCode: detail.ProductCode,
                        ProductName: detail.ProductName,
                        ProductRemark: detail.ProductRemark,
                        UomId: detail.UomId,
                        UomUnit: detail.UomUnit,
                        PricePerDealUnit: detail.PricePerDealUnit,
                        Quantity: detail.Quantity,
                        BuyerId: detail.BuyerId,
                        BuyerCode: detail.BuyerCode,
                        DesignColor: detail.DesignColor,
                        FabricType: detail.FabricType,
                        POSerialNumber: detail.POSerialNumber,
                        Conversion : detail.Conversion,
                        DOCurrency : detail.DOCurrencyRate,
                        Rack: detail.Rack,
                        Level: detail.Level,
                        Box: detail.Box,
                        Colour: detail.Colour,
                        Area: detail.Area,
                        IsSave: detail.IsSave,
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
        this.service.create(this.data)
            .then(result => {
                alert("Data berhasil dibuat");
                this.router.navigateToRoute('create',{}, { replace: true, trigger: true });
            })
            .catch(e => {
                this.data.Items = this.ItemsData[0];
                if (e.statusCode === 500) {
                    alert("Gagal menyimpan, silakan coba lagi!");
                } else {
                    
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
                        
                        console.log(`Item ${itemIndex} error details:`, detailsErrors);
                        return {
                            Details: detailsErrors
                        };
                    });
                }
                 }
                

            })
    }
}