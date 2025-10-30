import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';


@inject(Router, Service)
export class View {
  hasCancel = true;
  hasEdit = true;
  hasDelete = true;

  constructor(router, service) {
    this.router = router;
    this.service = service;
  }

  async activate(params) {
    var id = params.id;
    let decoded = Base64Helper.decode(id);
    id = decoded;
    this.data = await this.service.getById(id);
    this.ressearch = params.search;
  }

  cancel(event) {
    this.router.navigateToRoute('list' , {search: this.ressearch });
  }

  edit(event) {
    const encoded = Base64Helper.encode(this.data.Id);
    this.router.navigateToRoute('edit', { id: encoded });
  }

  delete(event) {
    // this.service.delete(this.data).then(result => {
    //     this.cancel();
    // });
    this.dialog.prompt('Apakah anda yakin akan menghapus data ini?', 'Hapus Data Bukti Pemasukan Bank')
      .then(response => {
        if (response.ok) {
          this.service.delete(this.data)
            .then(result => {
              this.cancel();
            });
        }
      });
  }

}
