import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { ServiceCompare as InternNoteService } from '../service';

@inject(InternNoteService, Router)
export class View {
  search = '';
  selectedData = null;
  loading = false;
  searchTimeout = null;
  showRevisionTable = true;
  revisionData = [];
  revisionColumns = [
    { header: "No", value: "no" },
    { header: "No NI", value: "inNo" },
    { header: "No Invoice", value: "invoiceNo" },
    { header: "Nama Supplier", value: "supplierName" }
  ];
  childColumns = [
    { header: 'Nomor PO EKS', value: 'ePONo' },
    { header: 'Nomor Refpr', value: 'poSerialNumber' },
    { header: 'Nama Barang', value: 'productName' },
    { header: 'Jumlah', value: 'quantity' },
    { header: 'Satuan', value: 'uomUnit' },
    { header: 'Harga Satuan', value: 'pricePerDealUnit' },
    { header: 'Harga Total', value: 'priceTotal' }
  ];

  pageSize = 10;
  currentPage = 1;
  totalRows = 0;

  get totalPages() {
    return Math.max(1, Math.ceil(this.totalRows / this.pageSize));
  }

  get pages() {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) return;
    this.currentPage = page;
    this.fetchRevisionData();
  }

  constructor(service, router) {
    this.service = service;
    this.router = router;
  }

  activate(params) {
    this.loading = false;
    this.id = params.id;
    this.showRevisionTable = true;
    this.revisionData = [];
  }

  

  updatePageSize() {
    this.currentPage = 1; // Reset to the first page
    this.fetchRevisionData(); // Fetch data with the new page size
  }

  async fetchRevisionData() {
    this.loading = true;
    try {
      const params = {
        page: this.currentPage,
        size: this.pageSize
      };
      // Tambahkan keyword jika search minimal 3 karakter
      if (this.search && this.search.length >= 3) {
        params.keyword = this.search;
      }

      const result = await this.service.getInternNoteRevision(params);

      if (result && Array.isArray(result.data)) {
        this.totalRows = result.info.total || result.data.length;
        const dataToDisplay = result.data.slice(0, this.pageSize);

        this.revisionData = dataToDisplay.map((item, index) => ({
          no: (this.currentPage - 1) * this.pageSize + index + 1,
          Id: item.Id,
          inNo: item.inNo,
          invoiceNo: item.invoiceNo,
          supplierName: item.supplierName,
          items: (item.items || []).map(child => ({
            ePONo: child.ePONo,
            poSerialNumber: child.poSerialNumber,
            productName: child.product && child.product.Name,
            internNoteQuantity: child.internNoteQuantity,
            ePOQuantity: child.ePOQuantity,
            uomUnit: child.uomUnit && child.uomUnit.Unit,
            pricePerDealUnit: child.pricePerDealUnit,
            priceTotal: child.priceTotal,
            remarkDescription: child.remarkDescription,
            obQuantity: child.obQuantity,
            percentOB: child.percentOB
          })),
          _showChild: false
        }));
      } else {
        this.revisionData = [];
      }
    } catch (e) {
      console.error("Error fetching data:", e);
      this.revisionData = [];
    }
    this.loading = false;
  }

  searchChanged() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.currentPage = 1;
      this.fetchRevisionData();
    }, 400); // debounce 400ms
  }

  attached() {
    this.showRevisionTable = true;
    this.fetchRevisionData();
    const showRevision = sessionStorage.getItem('showRevision');
    const selectedPage = sessionStorage.getItem('selectedPage');
    if (showRevision === '1') {
      this.showRevisionTable = true;
      this.currentPage = parseInt(selectedPage, 10) || 1;
      sessionStorage.removeItem('showRevision');
      sessionStorage.removeItem('selectedPage');
      this.fetchRevisionData();
    }
  }

  toggleChild(row) {
    row._showChild = !row._showChild;
  }

  navigate() {
    this.router.navigateToRoute('main-page');
  }

  get paginationText() {
    const startRow = (this.currentPage - 1) * this.pageSize + 1;
    const endRow = Math.min(this.currentPage * this.pageSize, this.totalRows);
    return `Menampilkan ${startRow} sampai ${endRow} dari ${this.totalRows} baris`;
  }

  async deletedRow(row) {
    // Tampilkan konfirmasi ke user
    const yakin = window.confirm(`Apakah anda yakin menghapus data ini?`);
    if (!yakin) return;
    this.loading = true;
    try {
      await this.service.deleteRevision(row.Id);
      alert('Data berhasil dihapus.');
      this.fetchRevisionData(); // reload data tabel dari backend
    } catch (e) {
      alert('Gagal menghapus data.');
    }
    this.loading = false;
  }
}
