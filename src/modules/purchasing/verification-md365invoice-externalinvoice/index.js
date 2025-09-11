export class Index {
  configureRouter(config, router) {
    config.map([
      { route: ['', 'list'], moduleId: './list', name: 'list', nav: false, title: 'List: Verifikasi MD365 Invoice - External Invoice' },
      { route: 'create', moduleId: './create', name: 'create', nav: false, title: 'Create: Verifikasi MD365 Invoice - External Invoice' },
      { route: 'view/:id', moduleId: './view', name: 'view', nav: false, title: 'View: Verifikasi MD365 Invoice - External Invoice' },
    ]);

      this.router = router;
  }
}
