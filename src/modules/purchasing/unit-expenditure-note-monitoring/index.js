export class Index {
    configureRouter(config, router) {
        config.map([
            { route: ['', 'list'], moduleId: './list', name: 'list', nav: true, title: 'List Monitoring Bon Keluar Unit' },
            { route: 'view/:id', moduleId: './view', name: 'view', nav: false, title: 'View:Monitoring Bon Keluar Unit' },
        ]);

        this.router = router;
    }
}
