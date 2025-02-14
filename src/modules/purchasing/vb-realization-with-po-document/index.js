export class Index {
    configureRouter(config, router) {
        config.map([
            { route: ['', 'list'], moduleId: './list', name: 'list', nav: true, title: 'List: Realisasi Uang Muka Pembelian' },
            { route: 'view/:id', moduleId: './view', name: 'view', nav: false, title: 'View: Realisasi Uang Muka Pembelian' },
            { route: 'edit/:id', moduleId: './edit', name: 'edit', nav: false, title: 'Edit: Realisasi Uang Muka Pembelian' },
            { route: 'create', moduleId: './create', name: 'create', nav: false, title: 'Create: Realisasi Uang Muka Pembelian' }
        ]);

        this.router = router;
    }
}
