import { inject, bindable, computedFrom } from 'aurelia-framework';
import { Dialog } from '../../../../../components/dialog/dialog';
import numeral from 'numeral';
numeral.defaultFormat("0,0.00");
const GarmentProductLoader = require('../../../../../loader/garment-product-loader');
const GarmentCategoryLoader = require('../../../../../loader/garment-category-loader');
import { Service } from '../../service';
import { ServiceCore } from '../../service-core';
import { PRMasterDialog } from './pr-master-dialog';

const rateNumberFormat = "0,0.000";

// const materialLoader = require('../../../../../loader/material-md-loader');
const UomLoader = require('../../../../../loader/uom-loader');

@inject(Dialog, Service, ServiceCore)
export class CostCalculationMaterial {

    controlOptions = {
        control: {
            length: 12
        }
    };

    constructor(dialog, service, serviceCore) {
        this.dialog = dialog;
        this.service = service;
        this.serviceCore = serviceCore
    }

    @bindable categoryName = "";
    @bindable isProcess = false;
    @bindable categoryNames = "";
    @bindable isEdit = false;
    @bindable isCopy = false;
    activate(context) {
        this.context = context;
        this.data = context.data;
        this.error = context.error;
        this.options = context.options;
        this.readOnly = this.options.readOnly || false;
        this.isEdit = this.context.context.options.IsEditMaterial  || false;
        this.isCopy = this.context.context.options.IsCopyCC || false;
        console.log(this.isCopy);
        this.disabled = true;
        this.data.showDialog = this.data.showDialog === undefined ? (this.data.Category === undefined ? true : false) : (this.data.showDialog === true ? true : false);
        this.data.isFabricCM = this.data.isFabricCM ? this.data.isFabricCM : false;
        this.categoryNames = this.data.Category ? (this.data.Category.name || this.data.Category.Name || "").toUpperCase() : "";

        if (this.data.Category) {
            this.selectedCategory = this.data.Category;
            this.categoryIsExist = this.categoryNames == "FABRIC" ? true : false;

            if (this.categoryNames == 'PROCESS') {
                this.isProcess = true;
                if (!this.data.Id) {
                    //Calculated Price jika CC bukan tipe Subcon Keluar
                    if (this.data.CCType != "SUBCON KELUAR")
                        this.data.Price = this.calculateProcessPrice();

                    //Calculated Price jika CC tipe Subcon Keluar
                    else if (this.data.CCType == "SUBCON KELUAR") {
                        this.data.Price = this.calculateProcessPriceSubconOut();
                    };
                }
                
            }
        }

        if (this.data.Product) {
            if(this.isEdit || this.isCopy){
                if (this.data.Product.Code) {
                this.productCode = this.data.Product.Code;
                this.productCodeIsExist = true;
            }}
            else{
                this.productCode = this.data.Product.Code;
                if (this.data.Product.Code && this.data.Product.Name) {
                    this.productCodeIsExist = true;
                }
            }
            
            
            if (this.data.Product.Composition) {
                this.data.Product.Composition = this.data.Product.Composition;
                this.compositionIsExist = this.categoryNames == "FABRIC" ? true : false;
                this.selectedComposition = Object.assign({}, this.data.Product);
            }

           
            if (this.data.Product.Const) {
                this.data.Product.Const=(this.data.Product.Const);
                this.constructionIsExist = this.categoryNames == "FABRIC" ? true : false;
                this.selectedConstruction = Object.assign({}, this.data.Product);

            }

            if (this.data.Product.Yarn) {
                this.yarnIsExist = this.categoryNames == "FABRIC" ? true : false;
                this.selectedYarn = Object.assign({}, this.data.Product);
            }

            if (this.data.Product.Width) {
                this.selectedWidth = Object.assign({}, this.data.Product);
            }
        }

        if(this.data.Id || this.data.isCopy)
        {
            if (this.data.Category && this.categoryNames !== "FABRIC") {
                this.isReadOnly = true;
            }
        }
    }

    bind() {

    }

    // @bindable productCode = "Test";
    @bindable selectedCategory;
    @bindable categoryIsExist = false;
    async selectedCategoryChanged(newVal, oldVal) {
        this.data.Category = newVal;
        console.log(newVal);
        if (newVal) {
            this.selectedComposition = null;
            this.data.Description = "";
            this.data.ProductRemark = null;
            this.data.Quantity = 0;
            this.data.UOMQuantity = null;
            this.data.Price = 0;
            this.data.UOMPrice = null;
            this.data.Conversion = 0;
            this.data.ShippingFeePortion = 0;
            // this.data.Product = await this.serviceCore.getByName(newVal.name);
            this.productCode = "";

            this.categoryNames = this.data.Category ? (this.data.Category.name || this.data.Category.Name || "").toUpperCase() : "";

            if (this.categoryNames === "FABRIC") {
                this.categoryIsExist = true;
                // this.dialog.prompt("Apakah fabric ini menggunakan harga CMT?", "Detail Fabric Material")
                //     .then(response => {
                //         if (response == "ok") {
                //             this.data.isFabricCM = true;
                //         }
                //         this.data.showDialog = false;
                //     });
                
            } else if (this.categoryNames === "PROCESS" || this.categoryNames === "PROCESS SUBCON") {
                this.data.Product = await this.serviceCore.getByName(newVal.Name);
                let UOM = await this.serviceCore.getUomByUnit("PCS");
                this.data.UOMQuantity = UOM;
                this.data.UOMPrice = UOM;
                this.isProcess = true;
                this.data.Quantity = 1;
                this.data.Conversion = 1;
                this.categoryIsExist = false;
                this.productCode = this.data.Product ? this.data.Product.Code : "";
                //Calculated Price jika CC bukan tipe Subcon Keluar tapi Category Process
                if (this.data.CCType != "SUBCON KELUAR" && this.categoryNames === "PROCESS") {
                    this.data.Price = this.calculateProcessPrice(); 

                //Calculated Price jika CC tipe Subcon Keluar tapi Category Process
                } else if(this.data.CCType == "SUBCON KELUAR" && this.categoryNames === "PROCESS") {
                    this.data.Price = this.calculateProcessPriceSubconOut();

                //Disable IsProcess untuk jika Category PROCESS SUBCON
                } else if (this.categoryNames === "PROCESS SUBCON") {
                    this.isProcess = false;
                }
                
            } else {
                this.categoryIsExist = false;
                this.data.Product = await this.serviceCore.getByName(newVal.Name);
                this.productCode = this.data.Product ? this.data.Product.Code : "";
            }
        } else if (!newVal) {
            this.selectedComposition = null;
            this.categoryIsExist = false;
        }
         
    }

    calculateProcessPrice() {
        let CuttingFee = this.data.Wage.Value * this.data.SMV_Cutting * (100 / 70);
        let SewingFee = this.data.Wage.Value * this.data.SMV_Sewing * (100 / this.data.Efficiency.Value);
        let FinishingFee = this.data.Wage.Value * this.data.SMV_Finishing * (100 / 92);
        let THR = this.data.THR.Value * this.data.SMV_Total;
        let result = CuttingFee + SewingFee + FinishingFee + THR;
        return numeral(numeral(result).format(rateNumberFormat)).value();
    }

    calculateProcessPriceSubconOut() {
        let CuttingFee = 0;
        // let SewingFee = this.data.Wage.Value * this.data.SMV_Sewing * (100 / this.data.Efficiency.Value);
        let SewingFee = 0;
        let FinishingFee = 0;
        let THR = 0;
        switch (this.data.SubconType) {
            //Jika tipe subcon Sewing maka ingore SMV_Sewing
            case "SUBCON SEWING":
                CuttingFee = this.data.Wage.Value * this.data.SMV_Cutting * (100 / 70);
                FinishingFee = this.data.Wage.Value * this.data.SMV_Finishing * (100 / 92);
                THR = this.data.THR.Value * (this.data.SMV_Cutting + this.data.SMV_Finishing);
                break;
            //Jika tipe subcon Cutting Sewing maka ingore SMV_Sewing dan SMV_Cutting
            case "SUBCON CUTTING SEWING":
                FinishingFee = this.data.Wage.Value * this.data.SMV_Finishing * (100 / 92);
                THR = this.data.THR.Value * this.data.SMV_Finishing;
                break
             //Jika tipe subcon Cutting Sewing Finishing maka ignore semua SMV
            default:
                break;
        }
        // let THR = this.data.THR.Value * this.data.SMV_Total;
        let result = CuttingFee + SewingFee + FinishingFee + THR;
        return numeral(numeral(result).format(rateNumberFormat)).value();
    }


    @bindable selectedComposition;
    filterProductQuery = {};
    compositionIsExist = false;
    selectedCompositionChanged(newVal, oldVal) {
        if (newVal) {
            this.selectedConstruction = null;
            this.compositionIsExist = true;
            this.filterProductQuery = newVal.Composition;
        } else if (!newVal) {
            this.selectedConstruction = null;
            this.compositionIsExist = false;
        }
    }

    @bindable selectedConstruction;
    constructionIsExist = false;
    selectedConstructionChanged(newVal, oldVal) {
        if (newVal) {
            this.selectedYarn = null;
            this.constructionIsExist = true;
            this.filterProductQuery=newVal.Const;
        } else if (!newVal) {
            this.selectedYarn = null;
            this.constructionIsExist = false;
        }
    }

    @bindable selectedYarn;
    yarnIsExist = false;
    selectedYarnChanged(newVal, oldVal) {
        if (newVal) {
            this.yarnIsExist = true;
            this.selectedWidth = null;
            this.filterProductQuery=(newVal.Yarn);
        } else if (!newVal) {
            this.selectedWidth = null;
            this.yarnIsExist = false;
        }
    }

    @bindable productCode = "";
    productCodeIsExist = false;
    productCodeChanged(newVal, oldVal) {
        if (newVal) {
            this.productCodeIsExist = true;
        } else {
            this.productCodeIsExist = false;
        }
    }

    @bindable selectedWidth;
    selectedWidthChanged(newVal, oldVal) {
        this.data.Product = newVal;
        if (newVal) {
            // this.
            this.productCode = newVal.Code;
            this.data.Product.Width = newVal.Width;
            this.filterProductQuery=(newVal.Width);

            
            if (this.selectedComposition.Composition) {
                this.data.Product.Composition = this.selectedComposition.Composition;
            }

            if (this.selectedConstruction.Const.length > 0) {
                this.data.Product.Const = this.selectedConstruction.Const;
                this.data.Product.Yarn = this.selectedYarn.Yarn;
                this.data.Product.Width = this.selectedWidth.Width;
                 
            }

        } else if (!newVal) {
            this.productCode = "";
            this.data.Product = null;
        }
    }
    comodityView = (comodity) => {
        return`${comodity.Code} - ${comodity.Name}`
      }
    
    get garmentCategoryLoader() {
        return GarmentCategoryLoader;
    }
    get garmentProductConstLoader() {
        
            return (keyword) => {
                var filter = "";
                this.categoryNames = this.data.Category ? (this.data.Category.name || this.data.Category.Name || "").toUpperCase() : "";

                if (this.selectedCategory && this.selectedCategory.Name) {
                    if (this.selectedComposition && this.selectedComposition.Composition) {
                        if (this.selectedConstruction && this.selectedConstruction.Const && this.selectedConstruction.Const.length > 0) {
                            if (this.selectedYarn && this.selectedYarn.Yarn && this.selectedYarn.Yarn.length > 0) {
                                filter = JSON.stringify({ "Name": this.selectedCategory.Name, "Composition": this.selectedComposition.Composition, "const": this.selectedConstruction.Const, "yarn": this.selectedYarn.Yarn });
                            } else {
                                filter = JSON.stringify({ "Name": this.selectedCategory.Name, "Composition": this.selectedComposition.Composition, "const": this.selectedConstruction.Const });
                            }
                        } else {
                            filter = JSON.stringify({ "Name": this.selectedCategory.Name, "Composition": this.selectedComposition.Composition });
                        }
                    } else {
                        if (this.categoryNames == 'FABRIC') {
                            filter = JSON.stringify({ "Name": this.selectedCategory.Name })
                        }
                    }
                }
    
                return this.service.getGarmentProductConsts(keyword, filter)
                    .then((result) => {
                       return result;
                    });
            }
      
    }
    get garmentProductYarnLoader() {
        
        return (keyword) => {
            var filter = "";
                this.categoryNames = this.data.Category ? (this.data.Category.name || this.data.Category.Name || "").toUpperCase() : "";
            if (this.selectedCategory && this.selectedCategory.Name) {
                if (this.selectedComposition && this.selectedComposition.Composition) {
                    if (this.selectedConstruction && this.selectedConstruction.Const && this.selectedConstruction.Const.length > 0) {
                        if (this.selectedYarn && this.selectedYarn.Yarn && this.selectedYarn.Yarn.length > 0) {
                            filter = JSON.stringify({ "Name": this.selectedCategory.Name, "Composition": this.selectedComposition.Composition, "const": this.selectedConstruction.Const, "yarn": this.selectedYarn.Yarn });
                        } else {
                            filter = JSON.stringify({ "Name": this.selectedCategory.Name, "Composition": this.selectedComposition.Composition, "const": this.selectedConstruction.Const });
                        }
                    } else {
                        filter = JSON.stringify({ "Name": this.selectedCategory.Name, "Composition": this.selectedComposition.Composition });
                    }
                } else {
                    if (this.categoryNames == 'FABRIC') {
                        filter = JSON.stringify({ "Name": this.selectedCategory.Name })
                    }
                }
            }

            return this.service.getGarmentProductYarns(keyword, filter)
                .then((result) => {
                   return result;
                });
        }
  
}
get garmentProductWidthLoader() {
        
    return (keyword) => {
        var filter = "";
               this.categoryNames = this.data.Category ? (this.data.Category.name || this.data.Category.Name || "").toUpperCase() : "";
        if (this.selectedCategory && this.selectedCategory.Name) {
            if (this.selectedComposition && this.selectedComposition.Composition) {
                if (this.selectedConstruction && this.selectedConstruction.Const && this.selectedConstruction.Const.length > 0) {
                    if (this.selectedYarn && this.selectedYarn.Yarn && this.selectedYarn.Yarn.length > 0) {
                        filter = JSON.stringify({ "Name": this.selectedCategory.Name, "Composition": this.selectedComposition.Composition, "const": this.selectedConstruction.Const, "yarn": this.selectedYarn.Yarn });
                    } else {
                        filter = JSON.stringify({ "Name": this.selectedCategory.Name, "Composition": this.selectedComposition.Composition, "const": this.selectedConstruction.Const });
                    }
                } else {
                    filter = JSON.stringify({ "Name": this.selectedCategory.Name, "Composition": this.selectedComposition.Composition });
                }
            } else {
                if (this.categoryNames == 'FABRIC') {
                    filter = JSON.stringify({ "Name": this.selectedCategory.Name })
                }
            }
        }

        return this.service.getGarmentProductWidths(keyword, filter)
            .then((result) => {
               return result;
            });
    }

}
    getWidthText = (product) => {
        return product ? `${product.Width}` : '';
    }

    getYarnText = (product) => {
        return product ? `${product.Yarn}` : '';
    }

    getConstructionText = (product) => {
        return product ? `${product.Const}` : '';
    }

    async getGarmentByFilter() {
        return await this.garmentProductLoader('', this.filterProductQuery);
    }

    get garmentProductLoader() {
        return (keyword) => {
            var filter = "";

            this.categoryNames = this.data.Category ? (this.data.Category.name || this.data.Category.Name || "").toUpperCase() : "";

            if (this.selectedCategory && this.selectedCategory.Name) {
                if (this.selectedComposition && this.selectedComposition.Composition) {
                    if (this.selectedConstruction && this.selectedConstruction.Const && this.selectedConstruction.Const.length > 0) {
                        if (this.selectedYarn && this.selectedYarn.Yarn && this.selectedYarn.Yarn.length > 0) {
                            filter = JSON.stringify({ "Name": this.selectedCategory.Name, "Composition": this.selectedComposition.Composition, "const": this.selectedConstruction.Const, "yarn": this.selectedYarn.Yarn });
                        } else {
                            filter = JSON.stringify({ "Name": this.selectedCategory.Name, "Composition": this.selectedComposition.Composition, "const": this.selectedConstruction.Const });
                        }
                    } else {
                        filter = JSON.stringify({ "Name": this.selectedCategory.Name, "Composition": this.selectedComposition.Composition });
                    }
                } else {
                    if (this.categoryNames == 'FABRIC') {
                        filter = JSON.stringify({ "Name": this.selectedCategory.Name })
                    }
                }
            }

            return this.service.getGarmentProducts(keyword, filter)
                .then((result) => {
                    return result;
                });
        }
    }

    get garmentProductDistinctDescriptionLoader() {
        return (keyword) => {
            var filter = "";
            this.categoryNames = this.data.Category ? (this.data.Category.name || this.data.Category.Name || "").toUpperCase() : "";

            if (this.selectedCategory && this.selectedCategory.Name) {
                if (this.selectedComposition && this.selectedComposition.Composition) {
                    if (this.selectedConstruction && this.selectedConstruction.Const && this.selectedConstruction.Const.length > 0) {
                        if (this.selectedYarn && this.selectedYarn.Yarn && this.selectedYarn.properties.Yarn > 0) {
                            filter = JSON.stringify({ "Name": this.selectedCategory.Name, "Composition": this.selectedComposition.Composition, "const": this.selectedConstruction.Const, "yarn": this.selectedYarn.Yarn });
                        } else {
                            filter = JSON.stringify({ "Name": this.selectedCategory.Name, "Composition": this.selectedComposition.Composition, "const": this.selectedConstruction.Const });
                        }
                    } else {
                        filter = JSON.stringify({ "Name": this.selectedCategory.Name, "Composition": this.selectedComposition.Composition });
                    }
                } else {
                    if (this.categoryNames == 'FABRIC') {
                        filter = JSON.stringify({ "Name": this.selectedCategory.Name })
                    }
                }
            }

            return this.service.getGarmentProductsDistinctDescription(keyword, filter)
                .then((result) => {
                    return result;
                  
                });
        }
    }

    get uomLoader() {
        return UomLoader;
    }

 
uomView =(uom)=>{
    return uom?`${uom.Unit}` : "";
}

    @computedFrom('data.Quantity', 'data.Price', 'data.Conversion', 'data.isFabricCM')
    get total() {
        let total = 0;
        this.categoryNames = this.data.Category ? (this.data.Category.name || this.data.Category.Name || "").toUpperCase() : "";
        //Calculated Item jika bukan tipe Subcon Keluar
        if (this.data.CCType != "SUBCON KELUAR") {
            total = this.data.Quantity && this.data.Conversion && parseFloat(this.data.Price) ? (parseFloat(this.data.Price) / this.data.Conversion * this.data.Quantity) : 0;
            //total = numeral(total).format();
            if (this.data.isFabricCM) {
                this.data.Total = 0;
                this.data.TotalTemp = numeral(total).value();
                this.data.CM_Price = numeral(total).value();
            }
            else {
                this.data.Total = numeral(total).value();
                this.data.TotalTemp = numeral(total).value();;
                this.data.CM_Price = null;
            }
        //Calculated Item jika tipe Subcon Keluar
        } else if (this.data.CCType == "SUBCON KELUAR" && this.data.Category) {
            //Calculated Item jika Category PROCESS SUBCON
            if (this.categoryNames === "PROCESS SUBCON") {
                // total = this.data.Quantity && this.data.Conversion && parseFloat(this.data.Price) ? (parseFloat(this.data.Price) / this.data.Conversion * this.data.Quantity) : 0;
                total =  this.data.Price ?  parseFloat(this.data.Price) : 0;
                // //total = numeral(total).format();
                // switch (this.data.SubconType) {
                //     case "SUBCON SEWING":
                //         total = total * (this.data.SMV_Sewing);
                //         break;
                //     case "SUBCON CUTTING SEWING":
                //         total = total * (this.data.SMV_Sewing + this.data.SMV_Cutting);
                //         break;
                //     case "SUBCON CUTTING SEWING FINISHING":
                //         total = total * (this.data.SMV_Sewing + this.data.SMV_Cutting + this.data.SMV_Finishing);
                //         break;
                // }
            
                this.data.Total = numeral(total).value();
                this.data.TotalTemp = numeral(total).value();;
                this.data.CM_Price = null;
            //Calculated Item jika Category bukan PROCESS SUBCON
            } else {
                total = this.data.Quantity && this.data.Conversion && parseFloat(this.data.Price) ? (parseFloat(this.data.Price) / this.data.Conversion * this.data.Quantity) : 0;
                //total = numeral(total).format();
                if (this.data.isFabricCM) {
                    this.data.Total = 0;
                    this.data.TotalTemp = numeral(total).value();
                    this.data.CM_Price = numeral(total).value();
                }
                else {
                    this.data.Total = numeral(total).value();
                    this.data.TotalTemp = numeral(total).value();;
                    this.data.CM_Price = null;
                }
            }
        }
        total=parseFloat(total).toFixed(2);
        
        return total;
    }

    @computedFrom('data.ShippingFeePortion', 'data.TotalTemp')
    get totalShippingFee() {
        let totalShippingFee = numeral(this.data.ShippingFeePortion / 100 * this.data.TotalTemp).format();
        this.data.TotalShippingFee = numeral(totalShippingFee).value();
        return totalShippingFee;
    }

    @computedFrom('data.Category', 'data.Quantity', 'data.Conversion', 'data.QuantityOrder', 'data.FabricAllowance', 'data.AccessoriesAllowance')
    get budgetQuantity() {
        let allowance = 0;
        this.categoryNames = this.data.Category ? (this.data.Category.name || this.data.Category.Name || "").toUpperCase() : "";

        let fabricAllowance = this.data.FabricAllowance ? this.data.FabricAllowance : 0;
        let accessoriesAllowance = (this.data.AccessoriesAllowance && this.data.AccessoriesAllowance != 0)  ? this.data.AccessoriesAllowance : 0;
        if (this.data.Category) {
            if (this.categoryNames === "FABRIC") {
                allowance =  fabricAllowance / 100;
            } else {
                allowance = accessoriesAllowance / 100;
            }
        }
        let budgetQuantity = this.data.Quantity && this.data.Conversion ? this.data.Quantity * this.data.QuantityOrder / this.data.Conversion + allowance * this.data.Quantity * this.data.QuantityOrder / this.data.Conversion : 0;
        budgetQuantity = Math.ceil(budgetQuantity);
        this.data.BudgetQuantity = Math.ceil(budgetQuantity);
        return budgetQuantity;
    }

    clickPRMaster() {
        var productCategory = null;
        console.log(this.data);
        if(this.data.Category){
            productCategory = this.data.Category.Name;
            console.log(productCategory);
        }
        this.dialog.show(PRMasterDialog, { CCId: this.context.context.options.CCId || 0, SCId: this.context.context.options.SCId || 0, CategoryName: productCategory })
            .then(response => {
                if (!response.wasCancelled) {
                    this.error = {};

                    const result = response.output;

                    this.data.IsPRMaster = true;
                    this.data.PRMasterId = result.PRMasterId;
                    this.data.PRMasterItemId = result.PRMasterItemId;
                    this.data.POMaster = result.POMaster;

                    this.data.Category = result.Category;
                    this.data.Product = result.Product;
                    this.productCode = this.data.Product ? this.data.Product.Code : "";
                    this.data.Description = result.Description;

                    this.data.ProductRemark = null;
                    this.data.Quantity = 0;
                    this.data.UOMQuantity = null;
                    this.data.Price = result.BudgetPrice;
                    this.data.UOMPrice = result.PriceUom;
                    this.data.Conversion = 0;
                    // this.total = 0;
                    this.data.ShippingFeePortion = 0;
                    // this.totalShippingFee = 0;
                    // this.budgetQuantity = 0;
                    this.data.AvailableQuantity = result.AvailableQuantity;
                    this.categoryNames = this.data.Category ? (this.data.Category.name || this.data.Category.Name || "").toUpperCase() : "";
                    this.serviceCore.getCategoryId(this.data.Category.Id)
                        .then(category => {
                            this.data.Category = category;
                            if (this.categoryNames === "FABRIC") {
                                this.dialog.prompt("Apakah fabric ini menggunakan harga CMT?", "Detail Fabric Material")
                                    .then(response => {
                                        if (response == "ok") {
                                            this.data.isFabricCM = true;
                                        } else {
                                            this.data.isFabricCM = false;
                                        }
                                        this.data.showDialog = false;
                                    });
                            }
                        });
                }
            });
    }

    enterDelegate(event) {
        if (event.charCode === 13) {
            event.preventDefault();
            return false;
        }
        else
            return true;
    }
}
