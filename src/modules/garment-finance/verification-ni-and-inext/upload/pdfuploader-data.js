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
    { field: 'InvoiceNo', title: 'Nomor Invoice External' },
    { field: 'SupplierName', title: 'Supplier' },
    { field: 'VatDate', title: 'Tanggal VAT' },
    { field: 'TotalVat', title: 'Total VAT', formatter: (value) => value ? value.toLocaleString('id-ID') : '' },
    { field: 'GrandTotalAmount', title: 'Total Amount', formatter: (value) => value ? value.toLocaleString('id-ID') : '' },
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
          td.colSpan = 6;
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
        // Ambil semua cell yang bisa diedit
        const cells = rowEl.querySelectorAll('td');
        if (cells.length < 5) return;
        
        // Edit InvoiceNo (cell 0)
        const invoiceNoCell = cells[0];
        const originalInvoiceNo = doc.Header.InvoiceNo;
        invoiceNoCell.innerHTML = `<input type='text' class='form-control form-control-sm' value='${originalInvoiceNo}' style='width:100%' />`;
        
        // Supplier tetap (cell 1) - tidak diedit
        
        // VatDate tetap (cell 2) - tidak diedit
        
        // Edit TotalVat (cell 3)
        const totalVatCell = cells[3];
        const originalTotalVat = doc.Header.TotalVat || '';
        totalVatCell.innerHTML = `<input type='number' class='form-control form-control-sm' value='${originalTotalVat}' style='width:100%' />`;
        
        // Edit GrandTotalAmount (cell 4)
        const grandTotalCell = cells[4];
        const originalGrandTotal = doc.Header.GrandTotalAmount || '';
        grandTotalCell.innerHTML = `<input type='number' class='form-control form-control-sm' value='${originalGrandTotal}' style='width:100%' />`;
        
        // Autofocus pada field pertama
        const firstInput = invoiceNoCell.querySelector('input');
        if (firstInput) firstInput.focus();
        // Refresh detail row agar Quantity dan Price ikut jadi input
        const nextRow = rowEl.nextElementSibling;
        if (nextRow && nextRow.classList.contains('detail-row')) {
          const td = nextRow.querySelector('td');
          if (td) {
            td.innerHTML = this.detailFormatter(doc);
            // Tambahkan event listener untuk auto-calculate
            this.attachCalculationListeners(td, doc);
          }
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
        
        // Ambil semua cell yang ada input
        const cells = rowEl.querySelectorAll('td');
        if (cells.length < 5) return;
        
        // Simpan perubahan dari semua input
        const invoiceNoInput = cells[0].querySelector('input');
        if (invoiceNoInput) {
          doc.Header.InvoiceNo = invoiceNoInput.value;
        }
        
        // Supplier dan VatDate tidak diedit
        
        const totalVatInput = cells[3].querySelector('input');
        if (totalVatInput) {
          doc.Header.TotalVat = parseFloat(totalVatInput.value) || 0;
        }
        
        const grandTotalInput = cells[4].querySelector('input');
        if (grandTotalInput) {
          doc.Header.GrandTotalAmount = parseFloat(grandTotalInput.value) || 0;
        }
        
        rowEl.classList.remove('editing');
        
        // Setelah save, kembalikan semua input ke readonly display
        const updatedCells = rowEl.querySelectorAll('td');
        if (updatedCells.length >= 5) {
          // Kembalikan InvoiceNo ke readonly
          updatedCells[0].innerHTML = doc.Header.InvoiceNo;
          // Supplier dan VatDate sudah readonly
          // Kembalikan TotalVat ke readonly
          updatedCells[3].innerHTML = doc.Header.TotalVat ? doc.Header.TotalVat.toLocaleString('id-ID') : '';
          // Kembalikan GrandTotalAmount ke readonly
          updatedCells[4].innerHTML = doc.Header.GrandTotalAmount ? doc.Header.GrandTotalAmount.toLocaleString('id-ID') : '';
        }
        
        // Auto-update JSON display setelah save (commented for production)
        // this.showEditedJson();
        
        // Refresh detail row agar Quantity kembali ke read
        const nextRow = rowEl.nextElementSibling;
        if (nextRow && nextRow.classList.contains('detail-row')) {
          const td = nextRow.querySelector('td');
          if (td) {
            // Ambil semua input di detail row
            const inputs = td.querySelectorAll('input.form-control');
            if (inputs && doc.Items) {
              const itemCount = doc.Items.length;
              inputs.forEach((inputEl, idx) => {
                const fieldType = inputEl.getAttribute('data-field');
                const itemIdx = Math.floor(idx / 2); // Setiap item punya 2 field yang bisa diedit
                const fieldIdx = idx % 2; // 0=Quantity, 1=PricePerDealUnit
                
                if (itemIdx < itemCount) {
                  const val = inputEl.value;
                  if (fieldIdx === 0) {
                    doc.Items[itemIdx].Quantity = val === '' ? null : parseFloat(val);
                  } else if (fieldIdx === 1) {
                    doc.Items[itemIdx].PricePerDealUnit = val === '' ? null : parseFloat(val);
                  }
                  
                  // Hitung ulang TotalAmount
                  const qty = doc.Items[itemIdx].Quantity || 0;
                  const price = doc.Items[itemIdx].PricePerDealUnit || 0;
                  doc.Items[itemIdx].TotalAmount = qty * price;
                }
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

  // Method untuk menambahkan event listener auto-calculation
  attachCalculationListeners(container, doc) {
    const quantityInputs = container.querySelectorAll('.quantity-input');
    const priceInputs = container.querySelectorAll('.price-input');
    
    const calculateTotal = (itemIdx) => {
      const qtyInput = container.querySelector(`.quantity-input[data-itemidx='${itemIdx}']`);
      const priceInput = container.querySelector(`.price-input[data-itemidx='${itemIdx}']`);
      const totalCell = container.querySelector(`.total-amount-${itemIdx}`);
      
      if (qtyInput && priceInput && totalCell) {
        const qty = parseFloat(qtyInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        const total = qty * price;
        
        // Update display
        totalCell.textContent = total.toLocaleString('id-ID');
        
        // Update data model
        if (doc.Items[itemIdx]) {
          doc.Items[itemIdx].Quantity = qty;
          doc.Items[itemIdx].PricePerDealUnit = price;
          doc.Items[itemIdx].TotalAmount = total;
        }
      }
    };
    
    // Add listeners untuk quantity inputs
    quantityInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const itemIdx = parseInt(e.target.getAttribute('data-itemidx'));
        calculateTotal(itemIdx);
      });
    });
    
    // Add listeners untuk price inputs
    priceInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const itemIdx = parseInt(e.target.getAttribute('data-itemidx'));
        calculateTotal(itemIdx);
      });
    });
  }

  // Formatter untuk detail row (Items)
  detailFormatter(doc) {
    if (!doc.Items || !doc.Items.length) return '<em>Tidak ada detail barang</em>';
    let html = `<div style="padding:10px; background:#f5f5f5; border-radius:4px;">
      <strong>Detail Barang Invoice External:</strong><br>
      <table class='table table-bordered table-sm' style='background:#fff;'>
        <thead>
          <tr>
            <th style='display: none;'>Kode Produk</th>
            <th>Nama Barang</th>
            <th>Quantity</th>
            <th>Harga Satuan</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>`;
    const isEditing = this.editingDocId !== null && this.documents[this.editingDocId] === doc;
    for (let i = 0; i < doc.Items.length; i++) {
      const item = doc.Items[i];
      html += `<tr>
        <td style='display: none;'>${item.ProductCode || ''}</td>
        <td>${item.ProductName || ''}</td>
        <td>
          ${isEditing
            ? `<input type='number' class='form-control form-control-sm quantity-input' value='${item.Quantity == null ? '' : item.Quantity}' style='width:100%' data-field='Quantity' data-itemidx='${i}' />`
            : `${item.Quantity == null ? '' : item.Quantity.toLocaleString('id-ID')}`}
        </td>
        <td>
          ${isEditing
            ? `<input type='number' class='form-control form-control-sm price-input' value='${item.PricePerDealUnit == null ? '' : item.PricePerDealUnit}' style='width:100%' data-field='PricePerDealUnit' data-itemidx='${i}' />`
            : `${item.PricePerDealUnit ? item.PricePerDealUnit.toLocaleString('id-ID') : ''}`}
        </td>
        <td class='total-amount-${i}'>${item.TotalAmount ? item.TotalAmount.toLocaleString('id-ID') : ''}</td>
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
        InvoiceNo: doc.Header.InvoiceNo,
        SupplierName: doc.Header.SupplierName,
        VatDate: doc.Header.VatDate,
        TotalVat: doc.Header.TotalVat,
        GrandTotalAmount: doc.Header.GrandTotalAmount
      }]
    };
  }

  // Untuk binding data.bind di HTML agar tidak error parser
  getDocLoader(doc) {
    return (info) => this.loader(info, doc);
  }

  // Fungsi untuk menampilkan hasil edit JSON ke area <pre> (commented for production)
  /*
  showEditedJson() {
    const json = this.getEditedJson();
    const pre = document.getElementById('edited-json-view');
    if (pre) {
      pre.textContent = JSON.stringify(json, null, 2);
    }
  }
  */
}
