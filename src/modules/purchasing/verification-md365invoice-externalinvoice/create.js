import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';

@inject(Router)
export class Create {
    isScanning = false;
    constructor(router) {
        this.router = router;
    }

    bind() {
        // data awal kosong; detail akan muncul saat invoice dipilih di autocomplete
        this.data = {};
        this.error = {};
    }

    cancel(event) {
        if (confirm(`Apakah Anda yakin akan kembali?`))
            this.router.navigateToRoute('list');
    }

    async save(event) {
        const vm = this.dataFormRef;
        let selected = vm && vm.d365Invoice ? vm.d365Invoice : null;
        // Remove 'purchaseOrders' property if exists
        if (selected && selected.purchaseOrders) {
            delete selected.purchaseOrders;
        }
        if (!selected || !(selected.InvoiceId || selected.InvoiceNo)) {
            alert('Anda harus memilih Nomor Invoice terlebih dahulu.');
            return;
        }
        const scanResult = vm && vm.scanResult;
        const file = vm && vm.selectedFile;
        if (!scanResult && !file) {
            alert('Pastikan anda mengupload File Invoice');
            return;
        }
        // Aktifkan loader
        this.isScanning = true;
        try {
            console.log('[Cek Invoice] JSON yang akan dikirim:');
            console.log(JSON.stringify(selected, null, 2));
            let scanResultToSend = null;
            if (scanResult) {
                // Mapping ke template JSON yang benar
                let raw = scanResult;
                if (typeof scanResult === 'object' && scanResult.result) {
                    raw = scanResult.result;
                }
                const root = raw.data || raw.Data || raw;
                // Invoice
                let invoice = {};
                if (root.Invoice) {
                    invoice = {
                        Header: root.Invoice.Header || root.Invoice.header || {},
                        Items: root.Invoice.Items || root.Invoice.items || []
                    };
                } else {
                    invoice = {
                        Header: root.header || {},
                        Items: root.items || []
                    };
                }
                // PurchaseOrder
                let purchaseOrder = { PurchaseOrder: [] };
                if (root.PurchaseOrder && Array.isArray(root.PurchaseOrder.PurchaseOrder)) {
                    purchaseOrder.PurchaseOrder = root.PurchaseOrder.PurchaseOrder;
                }
                // DeliveryOrder
                let deliveryOrder = { DeliveryOrder: [] };
                if (root.DeliveryOrder && Array.isArray(root.DeliveryOrder.DeliveryOrder)) {
                    deliveryOrder.DeliveryOrder = root.DeliveryOrder.DeliveryOrder;
                }
                // TaxInvoice
                let taxInvoice = { TaxInvoice: {} };
                if (root.TaxInvoice && root.TaxInvoice.TaxInvoice) {
                    taxInvoice.TaxInvoice = root.TaxInvoice.TaxInvoice;
                }
                // Build payload sesuai template
                scanResultToSend = {
                    Invoice: invoice,
                    PurchaseOrder: purchaseOrder,
                    DeliveryOrder: deliveryOrder,
                    TaxInvoice: taxInvoice
                };
                console.log('[Cek Invoice] ScanResult (template) yang akan dikirim:', JSON.stringify(scanResultToSend, null, 2));
            } else if (file) {
                console.log('[Cek Invoice] File PDF yang dipilih:', file.name);
            }
            // Kirim ke backend, biarkan service.js yang handle FormData
            const service = this.service || (vm && vm.service);
            const response = await service.postCompareInvoice(selected, {
                scanResult: scanResultToSend ? JSON.stringify(scanResultToSend) : null,
                file: file
            });
            // Sukses
            this.isScanning = false;
            // Perbaiki pengecekan status response
            let status = response && (response.status || response.statusCode);
            if (typeof status === 'string') status = parseInt(status);
            if (status === 200) {
                if (window.confirm('Selamat Hasil Pengecekan Dokumen Invoice Sama!')) {
                    this.router.navigateToRoute('list');
                }
            } else if (status === 201) {
                if (window.confirm('Hasil Pengecekan Data Selesai, Terdapat Data yang berbeda.')) {
                    this.router.navigateToRoute('list');
                }
            } else {
                if (window.confirm('Hasil pengecekan selesai.')) {
                    this.router.navigateToRoute('list');
                }
            }
        } catch (e) {
            this.isScanning = false;
            const msg = e && e.message ? e.message : 'Terjadi masalah, jangan panik coba lagi';
            window.alert(msg);
        }
    }
}