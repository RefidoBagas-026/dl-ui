import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service, SpinningService } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service, SpinningService)
export class View {
    constructor(router, service, spinningService) {
        this.router = router;
        this.service = service;
        this.spinningService = spinningService;
    }

    async activate(params) {
        const decoded = Base64Helper.decode(params.id);
        var id = decoded;
        this.data = await this.service.getById(id);
    }

    list() {
        this.router.navigateToRoute('list');
    }

    cancelCallback(event) {
        this.list();
    }

    editCallback(event) {
        const encoded = Base64Helper.encode(this.data.Id);
        this.router.navigateToRoute('edit', { id: encoded });
    }

    async deleteCallback(event) {
        var inputFlag = await this.spinningService.validateInInput(this.data.Id);
        var outputFlag = await this.spinningService.validateInOutput(this.data.Id);

        if (inputFlag || outputFlag) {
            alert("Data ini tidak bisa dihapus, data ini sudah terpakai di Machine Output atau Input");
        } else {
            this.service.delete(this.data)
                .then(result => {
                    this.list();
                });
        }
    }
}
