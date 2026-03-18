import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service, ServiceFinance } from './service';
import { Dialog } from "../../../au-components/dialog/dialog";
import { RejectReason } from "./dialog-template/reject-reason";
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service, ServiceFinance, Dialog)
export class View {
    hasCancel = true;
    hasUnpost = false;

    constructor(router, service, serviceFinance, dialog) {
        this.router = router;
        this.service = service;
        this.serviceFinance = serviceFinance;
        this.dialog = dialog;
    }
    
    async activate(params) {

      var id = params.id;
      let decoded = Base64Helper.decode(id);
      id = decoded;
      this.poExId = decoded;
      this.data = await this.service.getById(id);
      this.IsVBWithPO = await this.serviceFinance.getVbWithPO(id);
      if(this.data.Currency){
         this.selectedCurrency=this.data.Currency;
      }

      if(this.data.Supplier){
         this.selectedSupplier=this.data.Supplier;
      }

      if(this.data.IncomeTax){
         this.selectedIncomeTax=this.data.IncomeTax.Name+" - "+this.data.IncomeTax.Rate;
      }
      if(this.data.IsApprovedAnggaran && !this.data.IsUnpost && !this.IsVBWithPO){
         this.hasUnpost = true;
      }  
    }
    
    cancel(event) {
        this.router.navigateToRoute('list');
    }

    // unpostPO(event) {
    //   this.service.unpost(this.poExId).then(result => {
    //       this.cancel();
    //   }).catch(e => {
    //       this.error = e;
    //   })
    // }

    unpostPO(event) {
           this.dialog.show(RejectReason, {message: "Silakan masukkan alasan reject:" })
            .then(response => {
            if (!response.wasCancelled) {
                const reason = response.output;
                if (!reason || String(reason).trim() === "") {
                alert('Alasan tidak boleh kosong.');
                return;
                }
                this.service
                .unpost(this.data.Id, String(reason).trim())
                .then((result) => {
                    this.cancel();
                })
                .catch((e) => {
                    this.error = e;
                });
            }
            });
        }

}
