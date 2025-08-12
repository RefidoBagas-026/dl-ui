export class Index {
  configureRouter(config, router) {
      config.map([
          { route: ['', 'list'], moduleId: './list', name: 'list', nav: false, title: 'List: Verifikasi MD365 Invoice - External Invoice' },
      ]);

      this.router = router;
  }
}
