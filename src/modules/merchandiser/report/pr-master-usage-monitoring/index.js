export class Index {
    configureRouter(config, router) {
        config.map([
            { route: ['', 'list'], moduleId: './list', name: 'list', nav: true, title: 'Monitoring Penggunaan PR Master' },
        ]);

        this.router = router;
    }
}
