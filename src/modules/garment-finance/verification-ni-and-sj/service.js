import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { RestService } from '../../../utils/rest-service';

// Service endpoint untuk data verification NI dan SJ
const serviceUri = 'garment-in-do-revision';

export class Service extends RestService {
    constructor(http, aggregator, config) {
        super(http, aggregator, config, "finance");
    }

    // Method untuk mengambil data list verification NI dan SJ
    // Search berdasarkan keyword: "INNo", "SupplierName", "InvoiceNo"
    search(info) {
        const endpoint = `${serviceUri}`;
        return super.list(endpoint, info);
    }

    getById(id) {
        // Placeholder
        return Promise.resolve({});
    }

    create(data) {
        // Placeholder
        return Promise.resolve({});
    }

    update(data) {
        // Placeholder
        return Promise.resolve({});
    }

    delete(Id) {
        const endpoint = `${serviceUri}/${Id}`;
        return super.delete(endpoint);
    }
}
