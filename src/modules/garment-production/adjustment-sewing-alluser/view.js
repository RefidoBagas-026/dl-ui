import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class View {
    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    async activate(params) {
        let id = params.id;
        var idDecoded = Base64Helper.decode(id);
        this.data = await this.service.read(idDecoded);
        this.selectedRO=this.data.RONo;
        
        this.selectedUnit=this.data.Unit;
        
        this.editCallback = null;
    }

    cancelCallback(event) {
        this.router.navigateToRoute('list');
    }

    // editCallback(event) {
    //     this.router.navigateToRoute('edit', { id: this.data.Id });
    // }

    // deleteCallback(event) {
    //     // if (confirm(`Hapus ${this.data.CutInNo}?`))
    //         this.service.delete(this.data)
    //             .then(result => {
    //                 alert(`delete data success`);
    //                 this.cancelCallback();
    //             })
    //             .catch(e => {
    //                 this.error = e;
    //             })
    // }
}