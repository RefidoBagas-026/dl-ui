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
