import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { RestService } from '../../../utils/rest-service';

// Service endpoint untuk data verification NI dan SJ

const serviceUri = 'garment-in-do-revision';
const serviceInternNotesUri = 'garment-intern-notes';

export class Service extends RestService {
    constructor(http, aggregator, config) {
        super(http, aggregator, config, "finance");
        this.purchasingService = new RestService(http, aggregator, config, "purchasing-azure");
    }

    // Method untuk mengambil data list verification NI dan SJ
    // Search berdasarkan keyword: "INNo", "SupplierName", "InvoiceNo"
    search(info) {
        const endpoint = `${serviceUri}`;
        return super.list(endpoint, info);
    }

    getById(id) {
        const endpoint = `${serviceInternNotesUri}/${id}`;
        return this.purchasingService.get(endpoint);
    }

    create(data) {
        // Placeholder
        return Promise.resolve({});
    }

    update(data) {
        // Placeholder
        return Promise.resolve({});
    }

    // Method baru untuk mengambil data dari endpoint garment-intern-notes (purchasing)
    searchInternNotes(info) {
        const endpoint = serviceInternNotesUri;
        return this.purchasingService.list(endpoint, info);
    }

    delete(Id) {
        const endpoint = `${serviceUri}/${Id}`;
        return super.delete(endpoint);
    }
}
