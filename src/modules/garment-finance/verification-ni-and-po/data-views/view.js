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

  searchChanged() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    if (!this.search || this.search.length < 3) {
      this.selectedData = null;
      this.loading = false;
      return;
    }
    this.loading = true;
    this.searchTimeout = setTimeout(() => {
      this.service.search({
        page: 1,
        size: 1,
        keyword: this.search
      }).then(result => {
        let data = null;
        if (result.data) {
          if (Array.isArray(result.data)) {
            data = result.data[0];
          } else {
            data = result.data;
          }
        }
        if (data && data.Id) {
          this.service.getById(data.Id).then(detailResult => {
            if (detailResult && detailResult.data) {
              this.selectedData = detailResult.data;
            } else {
              this.selectedData = data;
            }
            this.loading = false;
          }).catch(() => {
            this.selectedData = data;
            this.loading = false;
          });
        } else {
          this.selectedData = null;
          this.loading = false;
        }
      }).catch(() => {
        this.selectedData = null;
        this.loading = false;
      });
    }, 300);
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
        size: this.pageSize // Ensure pageSize is passed to the API
      };

      console.log("Request Params:", params); // Log parameters sent to the API

      const result = await this.service.getInternNoteRevision(params);

      console.log("API Response:", result); // Log API response for debugging

      if (result && Array.isArray(result.data)) {
        this.totalRows = result.info.total || result.data.length; // Update totalRows

        // If the API does not respect the size parameter, filter data locally
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
