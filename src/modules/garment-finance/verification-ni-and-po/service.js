import { inject, Lazy } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { RestService } from '../../../utils/rest-service';
import { Container } from 'aurelia-dependency-injection';
import { Config } from "aurelia-api";

const serviceUri = 'garment-intern-notes';
const garmentExternalPurchaseOrderUri = 'garment-external-purchase-orders';
const invoiceNoteUri = 'garment-invoices/no-intern-note';
const serviceUriRevision = 'garment-intern-notes-revision';

export class Service extends RestService {
    constructor(http, aggregator, config, endpoint) {
        super(http, aggregator, config, "purchasing-azure");
    }

    search(info) {
        const endpoint = `${serviceUri}`;
        return super.list(endpoint, info);
    }

    getById(id) {
        const endpoint = `${serviceUri}/totalamountcalculation/${id}`;
        return super.get(endpoint);
    }

    getExternalPurchaseOrderById(id) {
        const endpoint = `${garmentExternalPurchaseOrderUri}/${id}`;
        return super.get(endpoint);
    }

    create(data) {
        const endpoint = `${serviceUri}`;
        return super.post(endpoint, data);
    }

    update(data) {
        const endpoint = `${serviceUri}/${data.Id}`;
        return super.put(endpoint, data);
    }

    delete(data) {
        const endpoint = `${serviceUri}/${data.Id}`;
        return super.delete(endpoint, data);
    }

    getPdfById(id) {
        const endpoint = `${serviceUri}/pdf/${id}`;
        return super.getPdf(endpoint);
    }

    getInvoiceNote(filter) {
        const endpoint = `${invoiceNoteUri}`;
        return super.list(endpoint, { filter: JSON.stringify(filter) });
    }

    getGarmentInvoiceById(id) {
        const endpoint = `garment-invoices/${id}`;
        return super.get(endpoint);
    }

    // Mendapatkan PDF sebagai blob URL untuk preview di iframe
    async getPdfBlobById(id) {
        const endpoint = `${serviceUri}/pdf/${id}`;
        const token = localStorage.getItem('token'); // ganti sesuai lokasi token FE Anda
        const response = await this.endpoint.client.fetch(endpoint, {
            method: 'GET',
            headers: new Headers({
                "Accept": "application/pdf",
                "x-timezone-offset": this.endpoint.defaults.headers["x-timezone-offset"],
                "Authorization": `Bearer ${token}`
            }),
        });
        if (!response.ok) throw new Error('Gagal fetch PDF: ' + response.status);
        const blob = await response.blob();
        return URL.createObjectURL(blob);
    }

    // Melakukan POST ke endpoint compare-internal-note-purchase-order-external dengan FormData (files) dan query garmentInternNoteId
    // async compareInternalNoteWithPO(files, garmentInternNoteId) {
    //     const endpoint = `${serviceUri}/compare-internal-note-purchase-order-external?garmentInternNoteId=${garmentInternNoteId}`;
    //     const formData = new FormData();
    //     if (files && files.length > 0) {
    //         for (let i = 0; i < files.length; i++) {
    //             formData.append('files', files[i]);
    //         }
    //     }
    //     const token = localStorage.getItem('token');
    //     const response = await this.endpoint.client.fetch(endpoint, {
    //         method: 'POST',
    //         headers: new Headers({
    //             'Authorization': `Bearer ${token}`
    //         }),
    //         body: formData,
    //     });
    //     if (!response.ok) throw new Error('Gagal membandingkan NI dan PO: ' + response.status);
    //     return response.json();
    // }

    
}

export class ServiceCompare extends RestService {
    constructor(http, aggregator, config) {
        super(http, aggregator, config, "finance");
    }

    // Mendapatkan data revision dari garment-intern-notes-revision
    async getInternNoteRevision(params) {
        const endpoint = `${serviceUriRevision}`;
        const token = localStorage.getItem('token');
        const queryString = new URLSearchParams(params).toString();
        const response = await this.endpoint.client.fetch(`${endpoint}?${queryString}`, {
            method: 'GET',
            headers: new Headers({
                'Authorization': `Bearer ${token}`
            })
        });
        if (!response.ok) throw new Error('Gagal mengambil data revision: ' + response.status);
        return response.json();
    }

    deleteRevision(id) {
        const endpoint = `${serviceUriRevision}/${id}`;
        return super.delete(endpoint);
    }
}
