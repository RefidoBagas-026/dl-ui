import {inject} from 'aurelia-framework';
import {Service} from "./service";
import {Router} from 'aurelia-router';
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class List {

    data = [];

    info = {
        page: 1,
        size: 25,
        total: 0,
        keyword: ''
    };

    constructor(router, service) {
        this.service = service;
        this.router = router;
    }

    async activate() {

        this.info.page = 1;
        this.info.keyword = '';

        const result = await this.service.search(this.info);

        this.data = result.data;
        this.info = {
            ...this.info,
            ...result.info
        };
    }

    loadPage() {

        this.info.page = 1;

        this.service.search(this.info)
            .then(result => {

                this.data = result.data;

                this.info = {
                    ...this.info,
                    ...result.info,
                    page: 1
                };

                console.log(this.info);
            });
    }

    changePage(e) {

        let page = e.detail;

        const maxPage = Math.ceil(this.info.total / this.info.size);

        if (page < 1) {
            page = 1;
        }

        if (page > maxPage) {
            page = maxPage;
        }

        this.info.page = page;

        this.service.search(this.info)
            .then(result => {

                this.data = result.data;

                this.info = {
                    ...this.info,
                    ...result.info
                };
            });
    }
    
    view(data) {
        const encoded = Base64Helper.encode(data._id);
        this.router.navigateToRoute('view', { id: encoded });
    }

    create() {
        this.router.navigateToRoute('create');
    }
}