export class Index {
  configureRouter(config, router) {
    config.map([
      {
        route: ['', 'list'],
        moduleId: './list',
        name: 'list',
        nav: false,
        title: 'List: Verifikasi NI dan Invoice External'
      },
      {
        route: 'main-page',
        moduleId: './compare-with-doc-ai/main-page',
        name: 'main-page',
        nav: false,
        title: 'Main Page'
      }
    ]);

    this.router = router;
  }
}
