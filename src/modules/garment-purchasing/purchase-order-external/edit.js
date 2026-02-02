import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';


@inject(Router, Service)
export class Edit {
    hasCancel = true;
    hasSave = true;
    ISEDIT = true;
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

        var kurs = await this.service.getKurs(this.data.Currency.Code, new Date(this.data.OrderDate).toLocaleDateString());
        this.kurs=kurs[0];

        if (!this.readOnly && (this.data.EPONo || "").includes("-R") && this.data.UENId) {
            const uen = await this.service.getUENById(this.data.UENId);
            this.kurs.Rate = this.data.BudgetRate || this.kurs.Rate;
            for (const item of this.data.Items) {
                const uenItem = uen.Items.find(i => i.Id == item.UENItemId);
                item.BudgetFromUEN = (uenItem.Quantity / uenItem.Conversion) * uenItem.PricePerDealUnit * this.kurs.Rate;
            }
        } else {
            this.data.BudgetRate = this.kurs.Rate;
        }

        if(this.data.Currency){
            this.selectedCurrency=this.data.Currency;
        }

        if(this.data.Supplier){
            this.selectedSupplier=this.data.Supplier;
            this.data.SupplierId=this.data.Supplier.Id;
            this.data.Supplier.usevat=this.data.IsUseVat ;
            if(this.data.IsIncomeTax){
                this.data.Supplier.usetax=true;
            }
        }

        if(this.data.IncomeTax){
            this.selectedIncomeTax=this.data.IncomeTax;
            this.data.IncomeTaxRate= this.data.IncomeTax.Rate;
        }

        if(this.data.Vat){
            this.selectedVatTax=this.data.Vat;
        }

        var getUsedBudget = [];
        for(var item of this.data.Items){
            getUsedBudget.push(this.service.getPoId(item.POId));
        }
        var pr=[];
        var initial=[];
        var remaining=[];
        return Promise.all(getUsedBudget)
            .then((listUsedBudget) => {
                for(var item of this.data.Items){
                    var Ipo= listUsedBudget.find(a=>a.Id==item.POId);
                    console.log(Ipo);
                    var po= Ipo.Items[0];
                    if(!initial[item.Id]){
                        initial[item.Id]=po.RemainingBudget + item.UsedBudget;
                    }
                    else{
                        initial[item.Id]+= item.UsedBudget;
                    }
                }
                for(var a of this.data.Items){
                    var filter= a.PRNo + a.Product.Id;
                    a.Initial=initial[a.Id];
                    if(pr.length==0){
                        pr.push(a);
                        //a.budgetUsed=a.PricePerDealUnit*a.DealQuantity*this.kurs.Rate;
                        //remaining[a.PRNo + a.Product.Id]=a.Initial;
                        a.remainingBudget=a.Initial;
                        remaining[a.Id]=a.remainingBudget-a.UsedBudget;
                    }
                    // else{
                    //     var dup=pr.find(b=> b.PRNo == a.PRNo && b.Product.Id==a.Product.Id && b.PO_SerialNumber==a.PO_SerialNumber);
                    //     if(dup){
                    //         //a.budgetUsed=a.PricePerDealUnit*a.DealQuantity*this.kurs.Rate;
                    //         a.remainingBudget=remaining[a.Id];
                    //         remaining[a.Id]=a.remainingBudget-a.UsedBudget;
                    //     }
                    //     else{
                    //         pr.push(a);
                    //         //a.budgetUsed=a.PricePerDealUnit*a.DealQuantity*this.kurs.Rate;
                    //         a.remainingBudget=a.Initial;
                    //         remaining[a.Id]=a.remainingBudget-a.UsedBudget;
                    //     }
                    // }
                }
            });
    }

    cancel(event) {
        const encoded = Base64Helper.encode(this.data._id);
        this.router.navigateToRoute('view', { id: encoded });
    }

    save(event) {
        //this.data.Vat = this.selectedVatTax;
        this.service.update(this.data).then(result => {
            this.cancel();
        }).catch(e => {
            this.error = e;
        })
    }
}

