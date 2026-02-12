export class Index {
    configureRouter(config, router) {
        config.map([
            { route: ['', 'list'], moduleId: './list', name: 'list', nav: false, title: 'List: Nota Retur' },
            { route: 'create', moduleId: './create', name: 'create', nav: false, title: 'Create: Nota Retur' },
            { route: 'view/:id', moduleId: './view', name: 'view', nav: false, title: 'View: Nota Retur' },
            { route: 'edit/:id', moduleId: './edit', name: 'edit', nav: false, title: 'Edit: Nota Retur' },
        ]);

        this.router = router;
    }
}