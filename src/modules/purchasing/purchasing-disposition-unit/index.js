export class Index {
    configureRouter(config, router) {
        config.map([
            { route: ['', 'list'], moduleId: './list', name: 'list', nav: false, title: 'List: Disposisi Permintaan Unit' },
            { route: 'create', moduleId: './create', name: 'create', nav: false, title: 'Create: Disposisi Permintaan Unit' },
            { route: 'view/:id', moduleId: './view', name: 'view', nav: false, title: 'View: Disposisi Permintaan Unit' },
            { route: 'edit/:id', moduleId: './edit', name: 'edit', nav: false, title: 'Edit: Disposisi Permintaan Unit' },
        ]);

        this.router = router;
    }
}