export class Index {
    configureRouter(config, router) {
        config.map([
            { route: ['', 'list'], moduleId: './list', name: 'list', nav: false, title: 'List: Verifikasi NI dan Invoice External' },
            { route: 'view/:id', moduleId: './view', name: 'view', nav: false, title: 'View: Verifikasi NI dan Invoice External' },
        ]);

        this.router = router;
    }
}