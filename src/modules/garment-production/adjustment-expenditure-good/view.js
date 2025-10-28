import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class View {
    constructor(router, service) {
        this.router = router;
        this.service = service;
        this.isView= true;
    }

    async activate(params) {
        let id = params.id;
        var idDecoded = Base64Helper.decode(id);
        this.data = await this.service.read(idDecoded);
        this.selectedRO=this.data.RONo;
        
        this.selectedUnit=this.data.Unit;
        
        this.editCallback = null;

        var items=[];
        for(var item of this.data.Items){
            if(items.length==0){
                items.push(item);
            }
            else{
                let duplicate= items.find(a=>a.Size.Id==item.Size.Id && a.Uom.Id==item.Uom.Id);
                                    
                if(duplicate){
                    var idx= items.indexOf(duplicate);
                    duplicate.Quantity+=item.Quantity;
                    duplicate.RemainingQuantity+=item.Quantity;
                    items[idx]=duplicate;
                }else{
                    items.push(item);
                }
            }
            if(item.ReturQuantity>0){
                this.deleteCallback=null;
            }
        }
        this.data.Items=items;
    }

    cancelCallback(event) {
        this.router.navigateToRoute('list');
    }

    editCallback(event) {
        var idEncoded = Base64Helper.encode(this.data.Id);
        this.router.navigateToRoute('edit', { id: idEncoded });
    }

    deleteCallback(event) {
        // if (confirm(`Hapus ${this.data.CutInNo}?`))
            this.service.delete(this.data)
                .then(result => {
                    alert(`delete data success`);
                    this.cancelCallback();
                })
                .catch(e => {
                    this.error = e;
                })
    }
}