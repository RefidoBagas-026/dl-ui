import { inject } from 'aurelia-framework';
import { RestService } from '../../../utils/rest-service';

const serviceUri = 'txt-D365-invoice-revision';
const serviceUriScan = 'txt-D365-invoice-revision/scan-invoice';
const compareInvoiceUri = 'txt-D365-invoice-revision/compare-invoice';


@inject()
export class Service extends RestService {
    constructor(http, aggregator, config) {
        super(http, aggregator, config, "purchasing-azure");
    }

    /**
     * Search data list for Invoice External revision
     * @param {Object} info - Search parameters (keyword, page, size, order)
     */
    search(info) {
        const endpoint = `${serviceUri}`;
        return super.list(endpoint, info);
    }

    // this for get data invoice
    getInvoiceData(invoiceId) {
        return this.endpoint.client.fetch(`${serviceUri}/${invoiceId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch invoice data: ${response.status} ${response.statusText}`);
                }
                return response.json();
            });
    }

    // Upload file PDF ke endpoint scan invoice
    // FormData: key 'file'
    uploadFile(file) {
        if (!file) {
            return Promise.reject(new Error('File is required'));
        }
        const formData = new FormData();
        formData.append('file', file);
        return this.endpoint.client.fetch(serviceUriScan, {
            method: 'POST',
            body: formData
        }).then(response => {
            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
            }
            return response.json();
        });
    }

    /**
     * Compare Invoice D365 dengan hasil scan/file
     * @param {Object} invoiceObj - Data invoice D365 (akan di-JSON.stringify)
     * @param {Object} options - { scanResult: string, file: File }
     */
    postCompareInvoice(invoiceObj, options = {}) {
        const { scanResult = null, file = null } = options;

        if (!invoiceObj) {
            alert('D365 invoice data is required');
            return Promise.reject(new Error('D365 invoice data is required'));
        }

        const formData = new FormData();
        formData.append('D365Invoice', JSON.stringify(invoiceObj));

        if (scanResult) {
            formData.append('ScanResult', scanResult);
        } else if (file) {
            formData.append('File', file);
        } else {
            alert('Either scanResult or file is required');
            return Promise.reject(new Error('Either scanResult or file is required'));
        }

        return this.endpoint.client.fetch(compareInvoiceUri, {
            method: 'POST',
            body: formData
        }).then(response => {
            if (!response.ok) {
                alert(`Request failed: ${response.status} ${response.statusText}`);
                throw new Error(`Request failed: ${response.status} ${response.statusText}`);
            }
            return response.json();
        }).catch(error => {
            alert(`Error: ${error.message}`);
            throw error;
        });
    }

    /**
     * Get Invoice External revision by ID
     * @param {string} id - Invoice External revision ID
     */
    getById(id) {
        const endpoint = `${serviceUri}/${id}`;
        return super.get(endpoint);
    }

    /**
     * Delete Invoice External revision by ID
     * @param {string} id - Invoice External revision ID
     */
    delete(id) {
        const endpoint = `${serviceUri}/${id}`;
        return super.delete(endpoint);
    }
}


