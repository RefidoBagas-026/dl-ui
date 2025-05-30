export class Index {
    configureRouter(config, router) {
        config.map([
            { route: ['', 'list'], moduleId: './list', name: 'list', nav: false, title: 'List: Transit Warehouse OUT' },
            { route: 'create', moduleId: './create', name: 'create', nav: false, title: 'Create: Transit Warehouse OUT' },
            { route: 'view/:id', moduleId: './view', name: 'view', nav: false, title: 'View:  Transit Warehouse OUT' },
        ]);

        this.router = router;
    }
}