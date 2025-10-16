import { customElement, bindable } from 'aurelia-framework';

@customElement('pdfuploader-data')
export class PdfuploaderData {
  // Helper: parse string angka dengan format Indonesia ("1.982.300,00") menjadi Number 1982300.00
  // - Menghapus spasi, pemisah ribuan '.'
  // - Mengganti koma desimal "," menjadi "."
  // - Jika input sudah berformat internasional, tetap diparse normal
  parseLocaleNumber(str) {
    if (str == null) return null;
    if (typeof str === 'number') return isNaN(str) ? null : str;
    let s = String(str).trim();
    if (!s) return null;
    // Hilangkan semua spasi non-breaking dan biasa
    s = s.replace(/\s+/g, '');
    // Jika mengandung koma dan/atau titik, coba normalisasi gaya Indonesia
    // Kasus umum: "1.982.300,00" → hapus '.' → "1982300,00" → ganti ',' → '.' → "1982300.00"
    if (/,/.test(s)) {
      s = s.replace(/\./g, '');
      s = s.replace(/,/g, '.');
    } else {
      // Tidak ada koma, bisa jadi sudah format internasional dengan titik desimal
      // Hapus pemisah ribuan jika ada (misal "1,982,300.00"): sudah ditangani oleh parseFloat di banyak kasus,
      // namun untuk konsistensi remove comma grouping
      s = s.replace(/,/g, '');
    }
    const n = parseFloat(s);
    return isNaN(n) ? null : n;
  }
  // Mendapatkan JSON hasil edit (deep clone agar aman untuk export)
  getEditedJson() {
    return JSON.parse(JSON.stringify(this.scannedData));
  }
  // Status dokumen yang sedang diedit
  editingDocId = null;
  @bindable scannedData;

  get documents() {
    // Ambil array dokumen dari hasil scan
    return this.scannedData ? [this.scannedData] : [];
  }

  // State dokumen yang di-expand (pakai Set dokumen)
  expandedDocs = new Set();

  // Kolom untuk au-table (header)
  tableColumns = [
    { field: 'InvoiceDocumentNumber', title: 'Nomor Invoice External' },
    { field: 'SupplierName', title: 'Supplier' },
    {
      field: 'TaxInvoiceDateParsed', title: 'Tanggal Faktur Pajak', formatter: (value) => {
        if (!value) return '';
        const d = new Date(value);
        if (isNaN(d)) return value;
        const day = d.toLocaleDateString('id-ID', { day: '2-digit' });
        const month = d.toLocaleDateString('id-ID', { month: 'long' });
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
      }
    },
    {
      field: 'TaxInvoiceValueAddedTaxAmount', title: 'Nominal Faktur', formatter: (value) => {
        // Tampilkan selalu dengan format Indonesia dan 2 desimal
        if (value == null || value === '') return '';
        const num = Number(value);
        return isNaN(num) ? value : num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    },
    {
      field: 'IdrTotalPriceBeforeTax', title: 'DPP (IDR)', formatter: (value) => {
        if (value == null || value === '') return Number(0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const num = Number(value);
        return isNaN(num) ? value : num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    },
    {
      field: 'IdrTotalPriceAfterTax', title: 'Total Amount (IDR)', formatter: (value) => {
        if (value == null || value === '') return Number(0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const num = Number(value);
        return isNaN(num) ? value : num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    },
    {
      field: 'NonIdrTotalPriceBeforeTax', title: 'DPP (Non-IDR)', formatter: (value) => {
        if (value == null || value === '') return Number(0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const num = Number(value);
        return isNaN(num) ? value : num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    },
    {
      field: 'NonIdrTotalPriceAfterTax', title: 'Total Amount (Non-IDR)', formatter: (value) => {
        if (value == null || value === '') return Number(0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const num = Number(value);
        return isNaN(num) ? value : num.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    },
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
          td.colSpan = 9;
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
        if (cells.length < 8) return;

        // Edit InvoiceNo (cell 0)
        const invoiceNoCell = cells[0];
        const originalInvoiceNo = doc.Header.InvoiceDocumentNumber;
        invoiceNoCell.innerHTML = `<input type='text' class='form-control form-control-sm' value='${originalInvoiceNo}' style='width:100%' />`;

        // Supplier tetap (cell 1) - tidak diedit

        // VatDate tetap (cell 2) - tidak diedit
        const vatDateCell = cells[2];
        const originalVatDate = doc.Header.TaxInvoiceDateParsed;
        let parseDate = '';
        if (!originalVatDate) {
          parseDate = '';
        }
        const d = new Date(originalVatDate);
        if (isNaN(d)) {
          parseDate = '';
        }
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        parseDate = `${y}-${m}-${day}`;
        vatDateCell.innerHTML = `<input type='date' class='form-control form-control-sm' value='${parseDate}' style='width:100%' />`;

        // Edit TotalVat (cell 3)
        const totalVatCell = cells[3];
        const originalTotalVat = doc.Header.TaxInvoiceValueAddedTaxAmount;
        const totalVatDisplay = (originalTotalVat != null && !isNaN(Number(originalTotalVat)))
          ? Number(originalTotalVat).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : (originalTotalVat || '');
        // Ganti ke input text agar bisa menerima format lokal (mis. 198.300,00)
        totalVatCell.innerHTML = `<input type='text' class='form-control form-control-sm' value='${totalVatDisplay}' style='width:100%' />`;

        // Edit IdrTotalPriceBeforeTax (cell 4)
        const grandTotalCell = cells[4];
        const originalGrandTotal = doc.Header.IdrTotalPriceBeforeTax;
        const grandTotalDisplay = (originalGrandTotal != null && !isNaN(Number(originalGrandTotal)))
          ? Number(originalGrandTotal).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : (originalGrandTotal || Number(0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        grandTotalCell.innerHTML = `<input type='text' class='form-control form-control-sm' value='${grandTotalDisplay}' style='width:100%' />`;

        // Edit IdrTotalPriceAfterTax (cell 5)
        const grandTotalCell2 = cells[5];
        const originalGrandTotal2 = doc.Header.IdrTotalPriceAfterTax;
        const grandTotalDisplay2 = (originalGrandTotal2 != null && !isNaN(Number(originalGrandTotal2)))
          ? Number(originalGrandTotal2).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : (originalGrandTotal2 || Number(0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        grandTotalCell2.innerHTML = `<input type='text' class='form-control form-control-sm' value='${grandTotalDisplay2}' style='width:100%' />`;

        // Edit NonIdrTotalPriceBeforeTax (cell 6)
        const grandTotalCell3 = cells[6];
        const originalGrandTotal3 = doc.Header.NonIdrTotalPriceBeforeTax;
        const grandTotalDisplay3 = (originalGrandTotal3 != null && !isNaN(Number(originalGrandTotal3)))
          ? Number(originalGrandTotal3).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : (originalGrandTotal3 || Number(0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        grandTotalCell3.innerHTML = `<input type='text' class='form-control form-control-sm' value='${grandTotalDisplay3}' style='width:100%' />`;

        // Edit NonIdrTotalPriceAfterTax (cell 7)
        const grandTotalCell4 = cells[7];
        const originalGrandTotal4 = doc.Header.NonIdrTotalPriceAfterTax;
        const grandTotalDisplay4 = (originalGrandTotal4 != null && !isNaN(Number(originalGrandTotal4)))
          ? Number(originalGrandTotal4).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
          : (originalGrandTotal4 || Number(0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
        grandTotalCell4.innerHTML = `<input type='text' class='form-control form-control-sm' value='${grandTotalDisplay4}' style='width:100%' />`;

        // Autofocus pada field pertama
        const firstInput = invoiceNoCell.querySelector('input');
        if (firstInput) firstInput.focus();

        // Tambahkan event listener untuk real-time JSON update pada header fields
        const headerInputs = rowEl.querySelectorAll('input.form-control');
        headerInputs.forEach((input, index) => {
          input.addEventListener('input', (e) => {
            const value = e.target.value;
            if (index === 0) { // InvoiceNo
              doc.Header.InvoiceDocumentNumber = value;
            } else if (index === 1) { // VatDate
              doc.Header.TaxInvoiceDateParsed = value;
            } else if (index === 2) { // TotalVat (Nominal Faktur) - terima format lokal
              const parsed = this.parseLocaleNumber(value);
              doc.Header.TaxInvoiceValueAddedTaxAmount = parsed != null ? parsed : 0;
            } else if (index === 3) { // DPP IDR - terima format lokal
              const parsed = this.parseLocaleNumber(value);
              doc.Header.IdrTotalPriceBeforeTax = parsed != null ? parsed : 0;
            } else if (index === 4) { // Total Amount IDR - terima format lokal
              const parsed = this.parseLocaleNumber(value);
              doc.Header.IdrTotalPriceAfterTax = parsed != null ? parsed : 0;
            } else if (index === 5) { // DPP Non-IDR - terima format lokal
              const parsed = this.parseLocaleNumber(value);
              doc.Header.NonIdrTotalPriceBeforeTax = parsed != null ? parsed : 0;
            } else if (index === 6) { // Total Amount Non-IDR - terima format lokal
              const parsed = this.parseLocaleNumber(value);
              doc.Header.NonIdrTotalPriceAfterTax = parsed != null ? parsed : 0;
            }
            // Real-time JSON update
            this.showEditedJson();
          });
        });

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
        if (cells.length < 8) return;

        // Simpan perubahan dari semua input

        // PATCH: Update langsung pada root scannedData agar parent ikut berubah
        // Karena documents() return [this.scannedData], maka doc === this.scannedData
        if (this.scannedData && doc === this.scannedData) {
          const invoiceNoInput = cells[0].querySelector('input');
          if (invoiceNoInput) {
            this.scannedData.Header.InvoiceDocumentNumber = invoiceNoInput.value;
          }

          // Supplier dan VatDate tidak diedit
          const vatDateInput = cells[2].querySelector('input');
          if (vatDateInput) {
            this.scannedData.Header.TaxInvoiceDateParsed = vatDateInput.value;
          }

          const totalVatInput = cells[3].querySelector('input');
          if (totalVatInput) {
            const parsed = this.parseLocaleNumber(totalVatInput.value);
            this.scannedData.Header.TaxInvoiceValueAddedTaxAmount = parsed != null ? parsed : 0;
          }

          const grandTotalInput = cells[4].querySelector('input');
          if (grandTotalInput) {
            const parsedGrand = this.parseLocaleNumber(grandTotalInput.value);
            this.scannedData.Header.IdrTotalPriceBeforeTax = parsedGrand != null ? parsedGrand : 0;
          }

          const grandTotalInput2 = cells[5].querySelector('input');
          if (grandTotalInput2) {
            const parsedGrand = this.parseLocaleNumber(grandTotalInput2.value);
            this.scannedData.Header.IdrTotalPriceAfterTax = parsedGrand != null ? parsedGrand : 0;
          }

          const grandTotalInput3 = cells[6].querySelector('input');
          if (grandTotalInput3) {
            const parsedGrand = this.parseLocaleNumber(grandTotalInput3.value);
            this.scannedData.Header.NonIdrTotalPriceBeforeTax = parsedGrand != null ? parsedGrand : 0;
          }

          const grandTotalInput4 = cells[7].querySelector('input');
          if (grandTotalInput4) {
            const parsedGrand = this.parseLocaleNumber(grandTotalInput4.value);
            this.scannedData.Header.NonIdrTotalPriceAfterTax = parsedGrand != null ? parsedGrand : 0;
          }
        }

        rowEl.classList.remove('editing');

        // Setelah save, kembalikan semua input ke readonly display
        const updatedCells = rowEl.querySelectorAll('td');
        if (updatedCells.length >= 8) {
          // Kembalikan InvoiceNo ke readonly
          updatedCells[0].innerHTML = doc.Header.InvoiceDocumentNumber;
          // Supplier dan VatDate sudah readonly
          let dateParsed = '';
          const value = doc.Header.TaxInvoiceDateParsed;
          if (!value) {
            dateParsed = '';
          } else {
            const d = new Date(value);
            if (isNaN(d)) {
              dateParsed = value;
            } else {
              const day = d.toLocaleDateString('id-ID', { day: '2-digit' });
              const month = d.toLocaleDateString('id-ID', { month: 'long' });
              const year = d.getFullYear();
              dateParsed = `${day}-${month}-${year}`;
            }
          }
          updatedCells[2].innerHTML = dateParsed;
          // Kembalikan TotalVat ke readonly (format Indonesia, 2 desimal)
          updatedCells[3].innerHTML = (doc.Header.TaxInvoiceValueAddedTaxAmount != null && !isNaN(Number(doc.Header.TaxInvoiceValueAddedTaxAmount)))
            ? Number(doc.Header.TaxInvoiceValueAddedTaxAmount).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : '';
          // Kembalikan GrandTotalAmount ke readonly (format Indonesia, 2 desimal)
          updatedCells[4].innerHTML = (doc.Header.IdrTotalPriceBeforeTax != null && !isNaN(Number(doc.Header.IdrTotalPriceBeforeTax)))
            ? Number(doc.Header.IdrTotalPriceBeforeTax).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : Number(0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          updatedCells[5].innerHTML = (doc.Header.IdrTotalPriceAfterTax != null && !isNaN(Number(doc.Header.IdrTotalPriceAfterTax)))
            ? Number(doc.Header.IdrTotalPriceAfterTax).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : Number(0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          updatedCells[6].innerHTML = (doc.Header.NonIdrTotalPriceBeforeTax != null && !isNaN(Number(doc.Header.NonIdrTotalPriceBeforeTax)))
            ? Number(doc.Header.NonIdrTotalPriceBeforeTax).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : Number(0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          updatedCells[7].innerHTML = (doc.Header.NonIdrTotalPriceAfterTax != null && !isNaN(Number(doc.Header.NonIdrTotalPriceAfterTax)))
            ? Number(doc.Header.NonIdrTotalPriceAfterTax).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : Number(0).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }

        // Auto-update JSON display setelah save
        this.showEditedJson();

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
                const itemIdx = parseInt(inputEl.getAttribute('data-itemidx'));

                if (itemIdx < itemCount) {
                  const val = inputEl.value;
                  if (fieldType === 'Quantity') {
                    doc.Items[itemIdx].Quantity = val === '' ? null : parseFloat(val);
                  }
                }
              });
            }
            // Setelah update data model, render ulang detail
            td.innerHTML = this.detailFormatter(doc);
          }
        }

        // Patch: assign ulang reference scannedData agar parent ikut update
        // (Aurelia binding: trigger update ke parent)
        this.scannedData = Object.assign({}, this.scannedData);
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
    const productCodeInputs = container.querySelectorAll('.product-code-input');

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

          // Real-time JSON update
          this.showEditedJson();
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
            <th>Kode Barang</th>
            <th>Nama barang</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>`;
    const isEditing = this.editingDocId !== null && this.documents[this.editingDocId] === doc;
    for (let i = 0; i < doc.Items.length; i++) {
      const item = doc.Items[i];
      html += `<tr>
        <td>${item.ProductCode || ''}</td>
        <td>${item.ProductName || ''}</td>
        <td>
          ${isEditing
          ? `<input type='number' class='form-control form-control-sm quantity-input' value='${item.Quantity == null ? '' : item.Quantity}' style='width:100%' data-field='Quantity' data-itemidx='${i}' />`
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
        InvoiceDocumentNumber: doc.Header.InvoiceDocumentNumber,
        SupplierName: doc.Header.SupplierName,
        TaxInvoiceDateParsed: doc.Header.TaxInvoiceDateParsed,
        TaxInvoiceValueAddedTaxAmount: doc.Header.TaxInvoiceValueAddedTaxAmount,
        IdrTotalPriceBeforeTax: doc.Header.IdrTotalPriceBeforeTax,
        IdrTotalPriceAfterTax: doc.Header.IdrTotalPriceAfterTax,
        NonIdrTotalPriceBeforeTax: doc.Header.NonIdrTotalPriceBeforeTax,
        NonIdrTotalPriceAfterTax: doc.Header.NonIdrTotalPriceAfterTax
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
