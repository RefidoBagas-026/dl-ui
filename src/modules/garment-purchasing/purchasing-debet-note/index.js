export class Index {
    configureRouter(config, router) {
        config.map([
            { route: ['', 'list'], moduleId: './list', name: 'list', nav: false, title: 'List: Nota Debet' },
            { route: 'create', moduleId: './create', name: 'create', nav: false, title: 'Create: Nota Debet' },
            { route: 'view/:id', moduleId: './view', name: 'view', nav: false, title: 'View: Nota Debet' },
            { route: 'edit/:id', moduleId: './edit', name: 'edit', nav: false, title: 'Edit: Nota Debet' },
        ]);

        this.router = router;
    }
}