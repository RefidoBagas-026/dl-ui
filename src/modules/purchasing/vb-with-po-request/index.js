export class Index {
  configureRouter(config, router) {
      config.map([
          { route: ['', 'list'], moduleId: './list', name: 'list', nav: false, title: 'List: UANG MUKA PEMBELIAN' },
          { route: 'create', moduleId: './create', name: 'create', nav: false, title: 'Create: UANG MUKA PEMBELIAN' },
          { route: 'view/:id', moduleId: './view', name: 'view', nav: false, title: 'View:  UANG MUKA PEMBELIAN' },
          { route: 'edit/:id', moduleId: './edit', name: 'edit', nav: false, title: 'Edit: UANG MUKA PEMBELIAN' },
      ]);

      this.router = router;
  }
}
