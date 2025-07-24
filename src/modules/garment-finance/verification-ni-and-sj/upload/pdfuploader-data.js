import { customElement, bindable } from 'aurelia-framework';

@customElement('pdfuploader-data')
export class PdfuploaderData {
  // Mendapatkan JSON hasil edit (deep clone agar aman untuk export)
  getEditedJson() {
    return JSON.parse(JSON.stringify(this.scannedData));
  }
  // Status dokumen yang sedang diedit
  editingDocId = null;
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
    {
      field: 'aksi',
      title: 'Aksi',
      formatter: (v, row, idx) => `
        <button class='btn btn-info btn-sm' data-toggle='expand' data-docid='${idx}'>i</button>
        <span style='margin-left: 4px;'></span>
        <button class='btn btn-warning btn-sm' title='Edit' data-toggle='edit' data-docid='${idx}'>
          <i class='fa fa-edit'></i>
        </button>
        <span style='margin-left: 4px;'></span>
        <button class='btn btn-success btn-sm' title='Save' data-toggle='save' data-docid='${idx}'>
          <i class='fa fa-save'></i>
        </button>
      `,
      width: 200,
      align: 'center',
      sortable: false
    }
  ];
  attached() {
    // Event delegation untuk tombol expand/collapse
    this._expandHandler = (e) => {
      const btn = e.target.closest('[data-toggle="expand"]');
      if (btn) {
        const docIdx = parseInt(btn.getAttribute('data-docid'), 10);
        const doc = this.documents[docIdx];
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
      // Event handler untuk tombol Edit
      const editBtn = e.target.closest('[data-toggle="edit"]');
      if (editBtn) {
        const docIdx = parseInt(editBtn.getAttribute('data-docid'), 10);
        const doc = this.documents[docIdx];
        if (!doc) return;
        this.editingDocId = docIdx;
        const rowEl = editBtn.closest('tr');
        if (!rowEl) return;
        // Cek apakah sudah dalam mode edit
        if (rowEl.classList.contains('editing')) return;
        rowEl.classList.add('editing');
        // Ambil cell DocumentNumber
        const docNumCell = rowEl.querySelector('td');
        if (!docNumCell) return;
        const originalValue = doc.Header.DocumentNumber;
        // Ganti cell dengan input aktif
        docNumCell.innerHTML = `<input type='text' class='form-control form-control-sm' value='${originalValue}' style='width:100%' />`;
        // Autofocus
        const input = docNumCell.querySelector('input');
        if (input) input.focus();
        // Refresh detail row agar Quantity ikut jadi input
        const nextRow = rowEl.nextElementSibling;
        if (nextRow && nextRow.classList.contains('detail-row')) {
          const td = nextRow.querySelector('td');
          if (td) td.innerHTML = this.detailFormatter(doc);
        }
      }
      // Event handler untuk tombol Save
      const saveBtn = e.target.closest('[data-toggle="save"]');
      if (saveBtn) {
        const docIdx = parseInt(saveBtn.getAttribute('data-docid'), 10);
        const doc = this.documents[docIdx];
        if (!doc) return;
        this.editingDocId = null;
        const rowEl = saveBtn.closest('tr');
        if (!rowEl) return;
        // Ambil cell DocumentNumber
        const docNumCell = rowEl.querySelector('td');
        if (!docNumCell) return;
        const input = docNumCell.querySelector('input');
        if (input) {
          // Simpan perubahan DocumentNumber ke data model
          doc.Header.DocumentNumber = input.value;
          input.setAttribute('readonly', 'readonly');
          input.classList.add('bg-light'); // Bootstrap style agar tampak non-aktif
        }
        rowEl.classList.remove('editing');
        // Refresh detail row agar Quantity kembali ke read
        const nextRow = rowEl.nextElementSibling;
        if (nextRow && nextRow.classList.contains('detail-row')) {
          const td = nextRow.querySelector('td');
          if (td) {
            // Ambil semua input Quantity di detail
            const qtyInputs = td.querySelectorAll('input.form-control');
            if (qtyInputs && doc.Items) {
              qtyInputs.forEach((inputEl, idx) => {
                const val = inputEl.value;
                // Simpan ke data model
                doc.Items[idx].Quantity = val === '' ? null : parseFloat(val);
              });
            }
            // Setelah update data model, render ulang detail
            td.innerHTML = this.detailFormatter(doc);
          }
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
           
            <th>Nama Barang</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>`;
    const isEditing = this.editingDocId !== null && this.documents[this.editingDocId] === doc;
    for (const item of doc.Items) {
      html += `<tr>
        <td>${item.ProductDescription || ''}</td>
        <td>
          ${isEditing
            ? `<input type='text' class='form-control form-control-sm' value='${item.Quantity == null ? '' : item.Quantity}' style='width:100%' ${isEditing ? '' : 'readonly'} />`
            : `${item.Quantity == null ? '' : item.Quantity.toLocaleString('id-ID')}`}
        </td>
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

  // Fungsi untuk menampilkan hasil edit JSON ke area <pre>
  showEditedJson() {
    const json = this.getEditedJson();
    const pre = document.getElementById('edited-json-view');
    if (pre) {
      pre.textContent = JSON.stringify(json, null, 2);
    }
  }
}
