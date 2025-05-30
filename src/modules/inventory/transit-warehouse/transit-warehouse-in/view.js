import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';


@inject(Router, Service)
export class View {
    hasCancel = true;
    hasEdit = true;
    hasDelete = true;

    constructor(router, service) {
        this.router = router;
        this.service = service;
    }

    async activate(params) {
        var id = params.id;
        this.data = await this.service.getById(id);
        var remain=0;
        var total=0;
        if(this.data.Items && this.data.Items.length > 0) {
            for(var item of this.data.Items) {
                remain+=item.RemainingQuantity || 0;
                total+=item.Quantity || 0;
            }
        }

        if(total!=remain){
            this.hasEdit=false;
            this.hasDelete=false;
        }
    }

    cancel(event) {
        this.router.navigateToRoute('list');
    }

    edit(event) {
        this.router.navigateToRoute('edit', { id: this.data.Id });
    }

    delete(event) {
        this.service.delete(this.data).then(result => {
            this.cancel();
        });
    }
}
