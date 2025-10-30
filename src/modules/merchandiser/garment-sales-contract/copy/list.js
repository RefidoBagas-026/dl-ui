import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import Loader from "../../../../loader/garment-sales-contracts-loader";
import { Base64Helper } from '../../../../utils/base-64-coded-helper';

@inject(Router)
export class List {
    controlOptions = {
        label: {
            length: 2
        },
        control: {
            length: 3
        }
    };

    filter = {};

    get loader() {
        return Loader;
    }

    constructor(router) {
        this.router = router;
    }

    copy() {
        const encoded = Base64Helper.encode(this.data.Id);
        if (this.data) {
            this.router.navigateToRoute('copy', { id: encoded });
        }
    }
}
