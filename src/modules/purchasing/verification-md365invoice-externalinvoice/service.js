import { inject, Lazy } from 'aurelia-framework';
import { HttpClient } from 'aurelia-fetch-client';
import { RestService } from '../../../utils/rest-service';


const serviceUriScan = 'txt-D365-invoice-revision/scan-invoice';

export class Service extends RestService {

    constructor(http, aggregator, config, endpoint) {
        super(http, aggregator, config, "purchasing-azure");
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

}
// service.js for verification-md365invoice-externalinvoice
export class VerificationMD365InvoiceExternalInvoiceService {
    async getInvoiceList() {
        // Dummy data, replace with API call if available
        return [
            { noInvoice: "INV-001" },
            { noInvoice: "INV-002" },
            { noInvoice: "INV-003" }
        ];
    }

    async getInvoiceData(noInvoice) {
        // Dummy data, replace with API call if available
        return {
            items: [
                {
                    noInvoice,
                    tanggalInvoice: "2025-07-23",
                    noFakturPajak: "FP-12345",
                    totalPerItem: 100000,
                    totalInvoice: 110000,
                    mataUang: "IDR",
                    namaBarang: "Barang A",
                    qty: 10,
                    hargaPerItem: 10000,
                    tanggalFakturPajak: "2025-07-22",
                    nilaiPPNInvoice: 10000,
                    nilaiPPNFakturPajak: 10000,
                    noPO: "PO-001",
                    noSuratJalan: "SJ-001",
                    nilaiPPh: 5000,
                    totalDPP: 95000,
                    grandTotal: 115000
                }
            ]
        };
    }
}
