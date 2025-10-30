import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Dialog } from '../../../au-components/dialog/dialog'
import { Base64Helper } from '../../../utils/base-64-coded-helper';

@inject(Router, Service, Dialog)
export class View {
	constructor(router, service, dialog) {
		this.router = router;
		this.service = service;
		this.dialog = dialog;
	}

	async activate(params) {
		var id = params.id;
		var idDecode = Base64Helper.decode(id);
		this.data = await this.service.getById(idDecode);
	}

	cancelCallback(event) {
		this.router.navigateToRoute('list');
	}

	editCallback(event) {
		var idEncode = Base64Helper.encode(this.data.Id);
		this.router.navigateToRoute('edit', { id: idEncode });
	}

	deleteCallback(event) {
		this.dialog.prompt('Apakah yakin menghapus data?', 'Hapus Data')
			.then(response => {
				if (response.ok) {
					this.service.delete(this.data)
						.then(result => {
							this.cancelCallback();
						});
				}
			});

		// this.service.delete(this.data)
    //   .then(result => {
    //     this.cancelCallback();
    //   });
	}
}