
import { customElement, bindable } from 'aurelia-framework';

@customElement('pdfuploader-data')
export class PdfuploaderData {
  @bindable scannedData;

  get documents() {
    // Ambil array dokumen dari hasil scan
    return this.scannedData && this.scannedData.Document ? this.scannedData.Document : [];
  }

  // State dokumen yang di-expand (pakai Set dokumen)
  expandedDocs = new Set();

  // Kolom untuk au-table (header)
  tableColumns = [
    { field: 'DocumentNumber', title: 'Nomor Surat Jalan' },
    { field: 'aksi', title: 'Aksi', formatter: (v, row, idx) => `<button class='btn btn-info btn-sm' data-toggle='expand' data-docid='${row.DocumentNumber}'>i</button>`, width: 60, align: 'center', sortable: false }
  ];
  attached() {
    // Event delegation untuk tombol expand/collapse
    this._expandHandler = (e) => {
      const btn = e.target.closest('[data-toggle="expand"]');
      if (btn) {
        const docId = btn.getAttribute('data-docid');
        const doc = this.documents.find(d => d.Header.DocumentNumber == docId);
        if (!doc) return;
        const rowEl = btn.closest('tr');
        if (!rowEl) return;
        if (this.expandedDocs.has(doc)) {
          this.expandedDocs.delete(doc);
          // Remove detail row
          const nextRow = rowEl.nextElementSibling;
          if (nextRow && nextRow.classList.contains('detail-row')) {
            nextRow.remove();
          }
        } else {
          this.expandedDocs.add(doc);
          // Insert detail row after header row
          const detailRow = document.createElement('tr');
          detailRow.className = 'detail-row';
          const td = document.createElement('td');
          td.colSpan = 2;
          td.innerHTML = this.detailFormatter(doc);
          detailRow.appendChild(td);
          rowEl.parentNode.insertBefore(detailRow, rowEl.nextSibling);
        }
      }
    };
    this._container = document.querySelector('.pdfuploader-data-container');
    if (this._container) {
      this._container.addEventListener('click', this._expandHandler);
    }
  }
  // Formatter untuk detail row (Items)
  detailFormatter(doc) {
    if (!doc.Items || !doc.Items.length) return '<em>Tidak ada detail barang</em>';
    let html = `<div style="padding:10px; background:#f5f5f5; border-radius:4px;">
      <strong>Detail Barang:</strong><br>
      <table class='table table-bordered table-sm' style='background:#fff;'>
        <thead>
          <tr>
            <th>Kode Barang</th>
            <th>Nama Barang</th>
            <th>Jumlah</th>
          </tr>
        </thead>
        <tbody>`;
    for (const item of doc.Items) {
      html += `<tr>
        <td>${item.ProductCode || ''}</td>
        <td>${item.ProductDescription || ''}</td>
        <td>${item.Quantity == null ? '' : item.Quantity.toLocaleString('id-ID')}</td>
      </tr>`;
    }
    html += `</tbody></table></div>`;
    return html;
  }

  detached() {
    if (this._container && this._expandHandler) {
      this._container.removeEventListener('click', this._expandHandler);
    }
  }

  // Option table false semua (header)
  tableOptions = {
    pagination: false,
    showColumns: false,
    search: false,
    showToggle: false,
    striped: false,
    sortable: false,
    searchOnEnterKey: false,
    showRefresh: false,
    smartDisplay: false,
  };

  // Loader untuk au-table, satu dokumen saja
  loader(info, doc) {
    if (!doc) return { total: 0, data: [] };
    return {
      total: 1,
      data: [{
        DocumentNumber: doc.Header.DocumentNumber
      }]
    };
  }

  // Untuk binding data.bind di HTML agar tidak error parser
  getDocLoader(doc) {
    return (info) => this.loader(info, doc);
  }
}
