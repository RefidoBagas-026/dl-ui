import { inject, Lazy } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Service } from './service';
import { Base64Helper } from '../../../../utils/base-64-coded-helper';


@inject(Router, Service)
export class Edit {
	isEdit = true;
	constructor(router, service) {
		this.router = router;
		this.service = service;
	}

	async activate(params) {
		let id = params.id;
		var idDecode = Base64Helper.decode(id);
		this.data = await this.service.getById(id);
	}

	cancelCallback(event) {
		var idEncode = Base64Helper.encode(this.data.Id);
		this.router.navigateToRoute('view', { id: idEncode });
	}

	saveCallback(event) {

		this.service.update(this.data)
			.then(result => {
				var idEncode = Base64Helper.encode(this.data.Id);
				this.router.navigateToRoute('view', { id: idEncode });
			})
			.catch(e => {
				this.error = e;
			})
	}
}
