import {inject} from 'aurelia-framework';
import {Service} from "./service";
import {Router} from 'aurelia-router';
import {Base64Helper} from '../../../utils/base-64-coded-helper';

@inject(Router, Service)
export class List {
    data = [];
    info = { page: 1, keyword: '' };

    constructor(router, service) {
        this.service = service;
        this.router = router;

    }

    async activate() {
        this.info.keyword = '';
        var result = await this.service.search(this.info);
        this.data = result.data;
        this.info = result.info;
    }

    loadPage() {
        var keyword = this.info.keyword;
        this.service.search(this.info)
            .then(result => {
                this.data = result.data;
                this.info = result.info;
                this.info.keyword = keyword;
            })
    }

    changePage(e) {
        var page = e.detail;
        this.info.page = page;
        this.loadPage();
    }

    back() {
        this.router.navigateToRoute('list');
    }

    view(data) {
        const encoded = Base64Helper.encode(data.Id);
        this.router.navigateToRoute('view', { id: encoded });
    }

    create() {
        this.router.navigateToRoute('create');
    }

    exportPDF(data) {
        this.service.getPdfById(data.Id);
    }

}