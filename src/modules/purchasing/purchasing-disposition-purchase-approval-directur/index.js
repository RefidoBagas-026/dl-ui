export class Index {
    configureRouter(config, router) {
        config.map([
            { route: ['', 'list'], moduleId: './list', name: 'list', nav: false, title: 'List: Disposition Pembelian Approval - Directur Keuangan' },
            { route: 'create', moduleId: './create', name: 'create', nav: false, title: 'Create: Disposition Pembelian Approval - Directur Keuangan' },
            { route: 'view/:id', moduleId: './view', name: 'view', nav: false, title: 'View: Disposition Pembelian Approval - Directur Keuangan' },
            { route: 'edit/:id', moduleId: './edit', name: 'edit', nav: false, title: 'Edit: Disposition Pembelian Approval - Directur Keuangan' },
        ]);

        this.router = router;
    }
}