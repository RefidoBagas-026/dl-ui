import {inject, Lazy} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {Service} from './service';
import { Base64Helper } from '../../../utils/base-64-coded-helper';


@inject(Router, Service)
export class Edit {

  constructor(router, service) {
      this.router = router;
      this.service = service;
  }

  async activate(params) {
      var id = params.id;
      var idDecoded = Base64Helper.decode(id);
      this.data = await this.service.getById(idDecoded);
  }

  cancelCallback(event) {
    var idEncoded = Base64Helper.encode(this.data.Id);
    this.router.navigateToRoute('view', { id: idEncoded });
  }

  saveCallback(event) {
      this.service.update(this.data)
          .then(result => {
              var idEncoded = Base64Helper.encode(this.data.Id);
              this.router.navigateToRoute('view', { id: idEncoded });
          })
          .catch(e => {
              this.error = e;
          })
  }
}
