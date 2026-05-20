import { inject } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { RestService } from '../../../utils/rest-service';

// Service untuk Verifikasi NI dan Invoice External Garment

const serviceUri = 'garment-invoice-external-revision';
const serviceInternNotesUri = 'garment-intern-notes';
const serviceInvoiceGarmentUri = 'garment-invoices';
const scanInvoiceExternalUri = 'garment-invoice-external-revision/scan-invoice-external';
const compareInternalNoteInvoiceExternalUri = 'garment-purchasing-expeditions/compare-internal-note-external-invoice';

export class Service extends RestService {
    constructor(http, aggregator, config) {
        super(http, aggregator, config, "finance");
        this.httpClient = http;
        this.purchasingService = new RestService(http, aggregator, config, "purchasing-azure");
    }

    // =====================================
    // INVOICE EXTERNAL REVISION METHODS
    // =====================================

    /**
     * Search data list verification NI dan Invoice External
     * @param {Object} info - Search parameters (keyword, page, size, order)
     */
    search(info) {
        const endpoint = `${serviceUri}`;
        return super.list(endpoint, info);
    }

    /**
     * Get Invoice External revision by ID
     * @param {string} id - Invoice External revision ID
     */
    getById(id) {
        const endpoint = `${serviceUri}/${id}`;
        return super.get(endpoint);
    }

    replace(id, data) {
        var endpoint = `${serviceUri}/${id}`;
        return super.patch(endpoint, data);
    }

    getPdfById(id) {
        var endpoint = `${serviceUri}/download/pdf/${id}`;
        return super.getPdf(endpoint);
    }

    /**
     * Create new Invoice External revision (Placeholder)
     * @param {Object} data - Invoice External revision data
     */
    create(data) {
        // Placeholder
        return Promise.resolve({});
    }

    /**
     * Update Invoice External revision (Placeholder)
     * @param {Object} data - Invoice External revision data
     */
    update(data) {
        // Placeholder
        return Promise.resolve({});
    }

    /**
     * Delete Invoice External revision by ID
     * @param {string} id - Invoice External revision ID
     */
    delete(id) {
        const endpoint = `${serviceUri}/${id}`;
        return super.delete(endpoint);
    }

    // =====================================
    // NOTA INTERN METHODS
    // =====================================

    /**
     * Search Nota Intern dari purchasing service
     * @param {Object} info - Search parameters (keyword, page, size, etc.)
     */
    searchInternNotes(info) {
        const endpoint = serviceInternNotesUri;
        //const endpoint = `${serviceInvoiceGarmentUri}`;
        return this.purchasingService.list(endpoint, info);
    }

    /**
     * Get detail Nota Intern by ID
     * @param {string} id - Nota Intern ID
     */
    getInternNoteById(id) {
        // Menggunakan endpoint invoice garment sesuai permintaan
        const endpoint = `${serviceInvoiceGarmentUri}/${id}`;
        return this.purchasingService.get(endpoint);
    }

    // =====================================
    // SCAN METHODS
    // =====================================

    /**
     * Upload PDF Invoice External ke endpoint scan-invoice-external
     * @param {File} file - PDF file to scan
     */
    uploadScanInvoiceExternal(file) {
        const endpoint = `${scanInvoiceExternalUri}`;
        const formData = new FormData();
        formData.append('file', file);
        return this.endpoint.client.fetch(endpoint, {
            method: 'POST',
            body: formData
        }).then(response => response.json());
    }

    // =====================================
    // COMPARISON METHODS
    // =====================================

    /**
     * Compare Internal Note dengan Invoice External
     * @param {string} garmentInvoiceId - ID Invoice Garment
     * @param {string} garmentInternNoteId - ID Nota Intern
     * @param {Object} options - { scanResult: string, file: File }
     */
    postCompareInternalNoteInvoiceExternal(garmentInvoiceId, garmentInternNoteId, { scanResult = null, file = null } = {}) {
        const endpoint = `${compareInternalNoteInvoiceExternalUri}?garmentInvoiceId=${garmentInvoiceId}&garmentInternNoteId=${garmentInternNoteId}`;

        const formData = new FormData();

        if (scanResult) {
            formData.append('ScanResult', scanResult);
        }

        if (file) {
            formData.append('File', file);
        }

        return this.endpoint.client.fetch(endpoint, {
            method: 'POST',
            headers: new Headers({
                "x-timezone-offset": this.endpoint.defaults.headers["x-timezone-offset"],
            }),
            body: formData
        }).then(response => response.json());
    }
}
