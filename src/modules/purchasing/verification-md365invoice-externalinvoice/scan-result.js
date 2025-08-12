import { bindable } from 'aurelia-framework';

export class ScanResult {
  @bindable scanData;

  header = {
    noInvoice: '',
    tanggalInvoice: '',
    dpp: 0,
    nilaiPpn: 0,
    nilaiPph: 0,
    totalAmount: 0,
  };

  items = [];
  poNumbers = [];
  sjNumbers = [];
  fakturList = [];

  scanDataChanged(newVal) {
    // Map scanData ke struktur baru jika tersedia
    if (!newVal) return;
    const h = newVal.header || newVal;
    this.header = {
      noInvoice: h.noInvoice || '',
      tanggalInvoice: h.tanggalInvoice || '',
      dpp: h.totalDPP || h.dpp || 0,
      nilaiPpn: h.nilaiPPNInvoice || h.nilaiPpn || 0,
      nilaiPph: h.nilaiPPh || h.nilaiPph || 0,
      totalAmount: h.grandTotal || h.totalAmount || 0,
    };

    // Items
    this.items = (newVal.items || []).map(it => ({
      kodeBarang: it.kodeBarang || it.kode || '',
      namaBarang: it.namaBarang || it.nama || '',
      qty: Number(it.qty || 0),
      hargaPerQty: Number(it.hargaPerItem || it.hargaPerQty || 0),
      total: Number(it.total || (it.qty || 0) * (it.hargaPerItem || it.hargaPerQty || 0))
    }));

    // PO & SJ
    this.poNumbers = Array.isArray(newVal.poNumbers) ? [...newVal.poNumbers] : (newVal.noPO ? [newVal.noPO] : []);
    this.sjNumbers = Array.isArray(newVal.sjNumbers) ? [...newVal.sjNumbers] : (newVal.noSuratJalan ? [newVal.noSuratJalan] : []);

    // Faktur Pajak list
    this.fakturList = Array.isArray(newVal.fakturList) ? [...newVal.fakturList] : ([{
      noFaktur: newVal.noFakturPajak || '',
      tanggalFaktur: newVal.tanggalFakturPajak || '',
      nilaiFaktur: newVal.nilaiPPNFakturPajak || 0
    }].filter(fp => fp.noFaktur));
  }

  addItem() {
    this.items.push({ kodeBarang: '', namaBarang: '', qty: 0, hargaPerQty: 0, total: 0 });
  }
  removeItem(index) {
    this.items.splice(index, 1);
    this.recalcHeaderTotals();
  }
  recalcItem(item) {
    const q = Number(item.qty || 0);
    const p = Number(item.hargaPerQty || 0);
    item.total = q * p;
    this.recalcHeaderTotals();
  }

  addPO() { this.poNumbers.push(''); }
  removePO(i) { this.poNumbers.splice(i, 1); }

  addSJ() { this.sjNumbers.push(''); }
  removeSJ(i) { this.sjNumbers.splice(i, 1); }

  addFaktur() { this.fakturList.push({ noFaktur: '', tanggalFaktur: '', nilaiFaktur: 0 }); }
  removeFaktur(i) { this.fakturList.splice(i, 1); }

  recalcHeaderTotals() {
    const dpp = this.items.reduce((sum, it) => sum + Number(it.total || 0), 0);
    this.header.dpp = dpp;
    const ppn = Number(this.header.nilaiPpn || 0);
    const pph = Number(this.header.nilaiPph || 0);
    this.header.totalAmount = dpp + ppn - pph;
  }

  saveScanResult() {
    // Kumpulkan payload untuk disimpan
    const payload = {
      header: { ...this.header },
      items: this.items.map(x => ({ ...x })),
      poNumbers: [...this.poNumbers],
      sjNumbers: [...this.sjNumbers],
      fakturList: this.fakturList.map(x => ({ ...x }))
    };
    // TODO: panggil service untuk simpan ke backend
    // this.service.save(payload)
    //   .then(_ => ...)
    //   .catch(err => this.error = err);
    console.log('ScanResult payload:', payload);
    alert('Data hasil scan berhasil disimpan!');
  }
}
