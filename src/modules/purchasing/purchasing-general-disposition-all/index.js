export class Index {
    configureRouter(config, router) {
        config.map([
            { route: ['', 'list'], moduleId: './list', name: 'list', nav: false, title: 'List: Disposisi Pembelian Umum' },
            { route: 'create', moduleId: './create', name: 'create', nav: false, title: 'Create: Disposisi Pembelian Umum' },
            { route: 'view/:id', moduleId: './view', name: 'view', nav: false, title: 'View: Disposisi Pembelian Umum' },
            { route: 'edit/:id', moduleId: './edit', name: 'edit', nav: false, title: 'Edit: Disposisi Pembelian Umum' },
        ]);

        this.router = router;
    }
}