import { inject } from 'aurelia-framework';
import { VerificationMD365InvoiceExternalInvoiceService } from "./service";

@inject(VerificationMD365InvoiceExternalInvoiceService)
export class VerificationMD365InvoiceExternalInvoiceList {
    invoices = [];
    selectedInvoice = '';
    invoiceData = null;
    files = null;
    uploadedFiles = [];
    scanData = null;

    constructor(service) {
        this.service = service;
    }

    async attached() {
        // Load invoice list on page load
        this.invoices = await this.service.getInvoiceList();
    }

    async loadInvoiceData() {
        if (!this.selectedInvoice) {
            this.invoiceData = null;
            return;
        }
        this.invoiceData = await this.service.getInvoiceData(this.selectedInvoice);
    }

    onAfterUpload() {
        // Simulasi hasil scan setelah upload PDF
        this.scanData = {
            noInvoice: this.selectedInvoice || '',
            tanggalInvoice: '2025-07-31',
            noFakturPajak: 'FP-98765',
            totalPerItem: 200000,
            totalInvoice: 220000,
            mataUang: 'IDR',
            namaBarang: 'Barang Scan',
            qty: 20,
            hargaPerItem: 10000,
            tanggalFakturPajak: '2025-07-30',
            nilaiPPNInvoice: 20000,
            nilaiPPNFakturPajak: 20000,
            noPO: 'PO-002',
            noSuratJalan: 'SJ-002',
            nilaiPPh: 10000,
            totalDPP: 190000,
            grandTotal: 230000
        };
    }
}
