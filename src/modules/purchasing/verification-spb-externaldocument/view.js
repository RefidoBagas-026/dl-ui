import { inject, computedFrom } from "aurelia-framework";
import { Router } from "aurelia-router";
import { Service, LocalService } from "./service";

@inject(Router, Service, LocalService)
export class View {
  static DEFAULT_DATE = "1900-01-01T12:00:00";

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

  hasCancel = true;
  data = null;
  id = null;
  controlOptions = {};

  showItemsTable = false;
  itemsData = [];
  itemsColumns = [
    { header: "Nama Barang", value: "itemName" },
    { header: "Qty", value: "quantity" },
    { header: "Harga Satuan", value: "unitPrice" },
  ];

  showURNsTable = false;
  urnsData = [];
  urnsColumns = [
    {
      field: "URNNo",
      title: "Nomor Bon Unit (SPB)",
    },
    {
      field: "URNNoScanResult",
      title: "Nomor Bon Unit (Hasil Scan)",
      formatter: (value, row, index) => {
        if (!value) return "-";

        return `
        <a href="javascript:void(0)"
           data-index="${index}"
           class="urn-scan-link">
          ${value}
        </a>
      `;
      },
    },
    {
      field: "ValidationStatus",
      title: "Validasi",
      formatter: (value) =>
        value === "Sesuai"
          ? `<span style="background-color: #28a745; color: white; padding: 3px 8px; border-radius: 3px; font-weight: bold;">Sesuai</span>`
          : `<span style="background-color: #dc3545; color: white; padding: 3px 8px; border-radius: 3px; font-weight: bold;">Tidak Sesuai</span>`,
    },
  ];

  showURNItemsTable = false;
  urnItemsData = [];
  activeURNIndex = null;

  onURNScanClick(event) {
    const link = event.target.closest(".urn-scan-link");
    if (!link) return;

    const index = Number(link.dataset.index);
    if (Number.isNaN(index)) return;

    if (this.activeURNIndex === index) {
      this.showURNItemsTable = false;
      this.activeURNIndex = null;
      return;
    }

    this.activeURNIndex = index;
    this.prepareItemValidation();
  }

  onPRScanClick(event) {
    const link = event.target.closest(".pr-scan-link");
    if (!link) return;

    const index = Number(link.dataset.index);
    if (Number.isNaN(index)) return;

    if (this.activePRIndex === index) {
      this.showPRItemsTable = false;
      this.activePRIndex = null;
      return;
    }

    this.activePRIndex = index;
    this.preparePRItems(index);
  }

  onPOScanClick(event) {
    const link = event.target.closest(".po-scan-link");
    if (!link) return;

    const index = Number(link.dataset.index);
    if (Number.isNaN(index)) return;

    if (this.activePOIndex === index) {
      this.showPOItemsTable = false;
      this.activePOIndex = null;
      return;
    }

    this.activePOIndex = index;
    this.preparePOItems(index);
  }

  // showInvoiceTable = false;
  // invoiceData = [];
  // invoiceColumns = [
  //   {
  //     field: "invoiceNo",
  //     title: "Nomor Invoice",
  //     formatter: (value, row) => (row && row.message ? row.message : value),
  //   },
  // ];

  showPRsTable = false;
  prsData = [];
  prsColumns = [
    {
      field: "PurchaseRequestNumber",
      title: "Nomor PR (SPB)",
    },
    {
      field: "PurchaseRequestNumberScanResult",
      title: "Nomor PR (Hasil Scan)",
      formatter: (value, row, index) => {
        if (!value) return "-";
        return `
        <a href="javascript:void(0)"
           data-index="${index}"
           class="pr-scan-link">
          ${value}
        </a>
      `;
      },
    },
    {
      field: "ValidationStatus",
      title: "Validasi",
      formatter: (value) =>
        value === "Sesuai"
          ? `<span style="background-color: #28a745; color: white; padding: 3px 8px; border-radius: 3px; font-weight: bold;">Sesuai</span>`
          : `<span style="background-color: #dc3545; color: white; padding: 3px 8px; border-radius: 3px; font-weight: bold;">Tidak Sesuai</span>`,
    },
  ];

  showPOsTable = false;
  posData = [];
  posColumns = [
    {
      field: "PONo",
      title: "Nomor PO (SPB)",
    },
    {
      field: "PONoScanResult",
      title: "Nomor PO (Hasil Scan)",
      formatter: (value, row, index) => {
        if (!value) return "-";
        return `
        <a href="javascript:void(0)"
           data-index="${index}"
           class="po-scan-link">
          ${value}
        </a>
      `;
      },
    },
    {
      field: "ValidationStatus",
      title: "Validasi",
      formatter: (value) =>
        value === "Sesuai"
          ? `<span style="background-color: #28a745; color: white; padding: 3px 8px; border-radius: 3px; font-weight: bold;">Sesuai</span>`
          : `<span style="background-color: #dc3545; color: white; padding: 3px 8px; border-radius: 3px; font-weight: bold;">Tidak Sesuai</span>`,
    },
    // {
    //   field: "actions",
    //   title: "",
    //   formatter: (value, row) =>
    //     `<button class="btn btn-info btn-sm" data-index="${row._poIndex}" onclick="window.showPODetail && window.showPODetail(event)">
    //     <i class="fa fa-info"></i>
    //    </button>`,
    // },
  ];

  // showTaxTable = false;
  // taxData = [];
  // taxColumns = [
  //   { field: "TaxInvoiceNumber", title: "No. Faktur Pajak" },
  //   {
  //     field: "TaxInvoiceDateOffset",
  //     title: "Tanggal Faktur",
  //     formatter: (v) => this.formatDate(v),
  //   },
  //   {
  //     field: "ValueAddedTax",
  //     title: "PPN",
  //     align: "right",
  //     formatter: (v) => this.formatNumber(v),
  //   },
  // ];

  showPOItems(index) {
    const row = this.data;
    if (!row || !Array.isArray(row.purchaseOrders)) return;

    const po = row.purchaseOrders[index];
    if (!po || !Array.isArray(po.Items)) return;

    this.poItemsData = po.Items;
    this.showPOItemsTable = true;

    console.log("[DEBUG] PO Items:", JSON.stringify(this.poItemsData, null, 2));
  }

  showPOItemsTable = false;
  poItemsData = [];
  activePOIndex = null;
  poItemsColumns = [
    { header: "Nama Item", value: "ItemName" },
    { header: "Qty", value: "Quantity" },
    { header: "Validasi", value: "ValidationStatus" },
  ];

  showPRItemsTable = false;
  prItemsData = [];
  activePRIndex = null;

  constructor(router, service, localService) {
    this.router = router;
    this.service = service;
    this.localService = localService;
    this.onURNScanClick = this.onURNScanClick.bind(this);
    this.onPRScanClick = this.onPRScanClick.bind(this);
    this.onPOScanClick = this.onPOScanClick.bind(this);

    this.actionFormatter = (value, row) =>
      `<button type="button" class="btn btn-primary btn-sm" data-action="info" data-id="${row.Id}">i</button>`;

    //this.onTableClick = this.onTableClick.bind(this);

    this.urnTableOptions = {
      ...this.tableOptions,
      formatNoMatches: () => "Tidak ada data",
    };

    // this.invoiceTableOptions = {
    //   ...this.tableOptions,
    //   formatNoMatches: () => "Data sudah sesuai",
    // };

    this.prTableOptions = {
      ...this.tableOptions,
      formatNoMatches: () => "Tidak ada data",
    };

    this.poTableOptions = {
      ...this.tableOptions,
      formatNoMatches: () => "Tidak ada data",
    };

    // this.taxTableOptions = {
    //   ...this.tableOptions,
    //   formatNoMatches: () => "Data sudah sesuai",
    // };
  }

  /**
   * Handle click events on table rows
   * @param {Event} event
   */
  onTableClick(event) {
    const target = event.target;
    const action = target.getAttribute("data-action");

    if (action === "info") {
      const id = target.getAttribute("data-id");
      this.showItemsTable = !this.showItemsTable;

      // Populate items data if available
      if (this.data && this.data.items && Array.isArray(this.data.items)) {
        this.itemsData = this.data.items;
      }
    }
  }

  formatNumber(value) {
    if (value == null || value === "") return "0";
    const num =
      typeof value === "string" ? Number(value.replace(/,/g, "")) : value;
    if (isNaN(num)) return value;
    return num.toLocaleString("id-ID");
  }

  /**
   * Navigate back to list
   * @param {Event} event
   */
  cancel(event) {
    this.router.navigateToRoute("list");
  }

  /**
   * @returns {Object}
   */

  isMatch(spbValue, scanValue) {
    if (!spbValue && !scanValue) return true;
    if (!spbValue || !scanValue) return false;
    return String(spbValue).trim() === String(scanValue).trim();
  }

  @computedFrom("data.items", "data.ppnValue", "data.pphValue")
  get totalAmount() {
    if (!this.data || !Array.isArray(this.data.items)) return 0;
    let sum = 0;
    for (const item of this.data.items) {
      const unitPrice =
        typeof item.unitPrice === "number"
          ? item.unitPrice
          : Number(item.unitPrice) || 0;
      const quantity =
        typeof item.quantity === "number"
          ? item.quantity
          : Number(item.quantity) || 0;
      sum += unitPrice * quantity;
    }
    const ppn = typeof this.ppnValue === "number" ? this.data.ppnValue : 0;
    const pph = typeof this.pphValue === "number" ? this.data.pphValue : 0;
    return sum + ppn + pph;
  }

  get safeData() {
    return this.data || {};
  }

  @computedFrom("totalAmount", "safeData.totalAmount")
  get highlightDifferencesTotal() {
    const total = this.totalAmount;
    const scanTotal = this.safeData.totalSPbScanResult || 0;
    const isDifferent = total !== scanTotal;
    console.log("[View] highlightDifferencesTotal:", {
      total,
      scanTotal,
      isDifferent,
    });
    return isDifferent;
  }

  @computedFrom("safeData.urns", "safeData.urns.length")
  get filteredURNs() {
    const { urns } = this.safeData;
    if (!Array.isArray(urns)) return [];

    return urns.map((urn) => {
      const isValid = this.isMatch(urn.URNNo, urn.URNNoScanResult);

      return {
        ...urn,
        ValidationStatus: isValid ? "Sesuai" : "Tidak Sesuai",
      };
    });
  }

  @computedFrom("safeData.invoices", "safeData.invoices.length")
  get filteredInvoices() {
    const { invoices } = this.safeData;
    if (!invoices || !Array.isArray(invoices)) {
      return [];
    }
    return invoices.filter((invoice) => invoice && invoice.InvoiceNo);
  }

  @computedFrom("safeData.prs")
  get filteredPRs() {
    const { prs } = this.safeData;
    if (!Array.isArray(prs)) return [];

    return prs.flatMap((group, groupIndex) =>
      Array.isArray(group.PRs)
        ? group.PRs.map((pr) => {
            const scanResult = pr.PurchaseRequestNumberScanResult || pr.PurchaseRequestNumber;
            const isValid = this.isMatch(pr.PurchaseRequestNumber, scanResult);
            
            return {
              ...pr,
              _groupIndex: groupIndex,
              PurchaseRequestNumberScanResult: scanResult,
              ValidationStatus: isValid ? "Sesuai" : "Tidak Sesuai",
            };
          })
        : [],
    );
  }

  @computedFrom("safeData.pos", "safeData.pos.length")
  get filteredPOs() {
    const { pos } = this.safeData;
    if (!Array.isArray(pos)) return [];

    return pos.map((po, idx) => {
      const isValid = this.isMatch(po.PONo, po.PONoScanResult);

      return {
        ...po,
        _poIndex: idx,
        ValidationStatus: isValid ? "Sesuai" : "Tidak Sesuai",
      };
    });
  }

  // @computedFrom("safeData.tax", "safeData.tax.length")
  // get filteredTax() {
  //   const { tax } = this.safeData;
  //   if (!tax || !Array.isArray(tax)) {
  //     return [];
  //   }
  //   return tax.filter((t) => t && t.fakturPajak);
  // }

  @computedFrom("safeData.fakturPajakDate")
  get highlightDifferencesFakturPajakDate() {
    return this.isValidDate(this.safeData.fakturPajakDate);
  }

  @computedFrom("safeData.fakturPajak")
  get highlightDifferencesFakturPajak() {
    return this.safeData.fakturPajak ? true : false;
  }

  @computedFrom("safeData.fakturPajakDate")
  get highlightDifferencesFakturPajakDate() {
    return this.isValidDate(this.safeData.fakturPajakDate);
  }

  @computedFrom("safeData.fakturPajakDate")
  get cleanedFakturPajakDate() {
    const { fakturPajakDate } = this.safeData;
    return this.isValidDate(fakturPajakDate) ? fakturPajakDate : null;
  }

  @computedFrom("safeData.spbDate")
  get highlightDifferencesSPBDate() {
    return this.isValidDate(this.safeData.spbDate);
  }

  @computedFrom("safeData.spbNo")
  get highlightDifferencesSPBNo() {
    return this.safeData.spbNo ? true : false;
  }

  @computedFrom("safeData.spbDate")
  get cleanedSPBDate() {
    const { spbDate } = this.safeData;
    return this.isValidDate(spbDate) ? spbDate : null;
  }

  @computedFrom("safeData.invoices")
  get highlightDifferencesInvoiceNo() {
    const { invoices } = this.safeData;
    if (!invoices || !Array.isArray(invoices) || !invoices[0]) return false;

    const invoiceNo = invoices[0].InvoiceNo || invoices[0].invoiceNo;
    return !!(invoiceNo && invoiceNo.trim() !== "");
  }

  @computedFrom("safeData.invoices")
  get cleanedInvoiceNo() {
    const { invoices } = this.safeData;
    if (!invoices || !Array.isArray(invoices) || !invoices[0]) return null;

    const invoiceNo = invoices[0].InvoiceNo || invoices[0].invoiceNo;
    return invoiceNo && invoiceNo.trim() !== "" ? invoiceNo : null;
  }

  @computedFrom("data.totalSPb", "data.totalSPbScanResult")
  get highlightDifferencesTotalSPb() {
    const a = this.data.totalSPb;
    const b = this.data.totalSPbScanResult;

    const validA = a !== null && a !== undefined && !isNaN(a);
    const validB = b !== null && b !== undefined && !isNaN(b);

    return validA || validB;
  }

  @computedFrom("data.totalSPb")
  get formattedTotalSPb() {
    const raw = this.data.totalSPb;
    if (raw === null || raw === undefined) return "—";

    const v = Number(raw);
    if (Number.isNaN(v)) return "—";

    return v.toFixed(2);
  }

  isValidDate(dateString) {
    if (!dateString) return false;
    return dateString !== View.DEFAULT_DATE;
  }

  // activate(params) {
  //   const idParam = params && params.id;
  //   this.id = typeof idParam === "string" ? Number(idParam) : idParam;

  //   const list = Array.isArray(window.listData) ? window.listData : [];
  //   const row = list.find((d) => String(d.Id) === String(this.id));

  //   if (!row) {
  //     this.data = null;
  //     return;
  //   }

  //   this.data = row;
  //   this.data.pos = Array.isArray(row.purchaseOrders) ? row.purchaseOrders : [];

  //   this.data.prs = Array.isArray(row.purchaseRequests)
  //     ? row.purchaseRequests
  //     : [];

  //   this.data.urns = Array.isArray(row.unitReceiptNotes)
  //     ? row.unitReceiptNotes
  //     : [];

  //   console.log("[View] PO count:", this.data.pos.length);
  //   console.log("[View] PR count:", this.data.prs.length);
  //   console.log("[View] URN count:", this.data.urns.length);
  //}

  async activate(params) {
    const idParam = params && params.id;
    this.id = typeof idParam === "string" ? Number(idParam) : idParam;

    // let data = await this.localService.getSPBData(this.id);
    let data = await this.service.getSPBData(this.id);

    if (!data) {
      const list = Array.isArray(window.listData) ? window.listData : [];
      data = list.find((d) => String(d.Id) === String(this.id)) || null;
    }

    this.data = data || {};

    if (!this.data.invoices || !Array.isArray(this.data.invoices)) {
      if (this.data.Invoice && Array.isArray(this.data.Invoice.Invoice)) {
        this.data.invoices = this.data.Invoice.Invoice.map((inv) => ({
          invoiceNo: inv.InvoiceNumber || "",
          invoiceNoScanResult: inv.InvoiceNumberScanResult || "",
        }));
      } else {
        this.data.invoices = [];
      }
    }

    if (
      !Array.isArray(this.data.pos) &&
      Array.isArray(this.data.purchaseOrders)
    ) {
      this.data.pos = this.data.purchaseOrders;
    }
    if (
      !Array.isArray(this.data.prs) &&
      Array.isArray(this.data.purchaseRequests)
    ) {
      this.data.prs = this.data.purchaseRequests;
    }
    if (
      !Array.isArray(this.data.urns) &&
      Array.isArray(this.data.unitReceiptNotes)
    ) {
      this.data.urns = this.data.unitReceiptNotes;
    }

    console.log("[View] Data SPB yang dipilih:", this.data);
  }

  // attached() {
  //   window.showPODetail = (e) => {
  //     const idx = e.target.getAttribute("data-index");
  //     this.showPOItems(idx);
  //   };

  //   const table = document.querySelector("table");
  //   if (table) table.addEventListener("click", this.onTableClick);
  // }

  attached() {
    // Add delay to ensure DOM is ready
    setTimeout(() => {
      const urnTable = document.querySelector("#urnTable");
      console.log("[attached] urnTable found:", urnTable);
      if (urnTable) {
        urnTable.addEventListener("click", this.onURNScanClick);
      }

      const prTable = document.querySelector("#prTable");
      console.log("[attached] prTable found:", prTable);
      if (prTable) {
        prTable.addEventListener("click", this.onPRScanClick);
      }

      const poTable = document.querySelector("#poTable");
      console.log("[attached] poTable found:", poTable);
      if (poTable) {
        poTable.addEventListener("click", this.onPOScanClick);
      }
    }, 500);
  }

  detached() {
    const urnTable = document.querySelector("#urnTable");
    if (urnTable) {
      urnTable.removeEventListener("click", this.onURNScanClick);
    }

    const prTable = document.querySelector("#prTable");
    if (prTable) {
      prTable.removeEventListener("click", this.onPRScanClick);
    }

    const poTable = document.querySelector("#poTable");
    if (poTable) {
      poTable.removeEventListener("click", this.onPOScanClick);
    }

    const table = document.querySelector("table");
    if (table) table.removeEventListener("click", this.onTableClick);
  }

  preparePRItems(index) {
    const pr = this.filteredPRs[index];
    console.log("[preparePRItems] index:", index);
    console.log("[preparePRItems] pr:", pr);
    console.log("[preparePRItems] filteredPRs:", this.filteredPRs);

    if (!pr) return;

    const isValid = this.isMatch(
      pr.PurchaseRequestNumber,
      pr.PurchaseRequestNumberScanResult,
    );

    this.prItemsData = [
      {
        ItemName: pr.ItemName || "-",
        Quantity: pr.Quantity || 0,
        ValidationStatus: isValid ? "Sesuai" : "Tidak Sesuai",
      },
    ];
    this.showPRItemsTable = true;
  }

  validateItem(item) {
    if (!item) return "Tidak ada data";

    const name = item.itemName;
    const qty = item.quantity;

    if (!name || qty === null || qty === undefined) {
      return "Tidak Sesuai";
    }

    const spbTotal = Number(this.data.totalSPb);
    const scanTotal = Number(this.data.totalSPbScanResult);

    if (Number.isNaN(spbTotal) || Number.isNaN(scanTotal)) {
      return "Tidak Sesuai";
    }

    return spbTotal === scanTotal ? "Sesuai" : "Tidak Sesuai";
  }

  prepareItemValidation() {
    const urn = this.filteredURNs[this.activeURNIndex];
    console.log("[prepareItemValidation] urn:", urn);
    console.log("[prepareItemValidation] activeURNIndex:", this.activeURNIndex);
    
    if (!urn) {
      console.log("[prepareItemValidation] URN not found");
      return;
    }

    const isValid = this.isMatch(urn.URNNo, urn.URNNoScanResult);
    const items = Array.isArray(this.data.items) ? this.data.items : [];
    
    console.log("[prepareItemValidation] items from data:", items);

    if (items.length === 0) {
      this.urnItemsData = [
        {
          ItemName: "-",
          Quantity: 0,
          ValidationStatus: "Tidak ada data",
        },
      ];
    } else {
      this.urnItemsData = items.map((item) => ({
        ItemName: item.itemName || item.ItemName || "-",
        Quantity: item.quantity || item.Quantity || 0,
        ValidationStatus: isValid ? "Sesuai" : "Tidak Sesuai",
      }));
    }

    console.log("[prepareItemValidation] urnItemsData:", this.urnItemsData);
    this.showURNItemsTable = true;
  }

  preparePOItems(index) {
    const po = this.filteredPOs[index];
    console.log("[preparePOItems] index:", index);
    console.log("[preparePOItems] po:", po);
    console.log("[preparePOItems] filteredPOs:", this.filteredPOs);

    if (!po) return;

    const isValid = this.isMatch(po.PONo, po.PONoScanResult);
    const items = Array.isArray(this.data.items) ? this.data.items : [];
    
    console.log("[preparePOItems] items from data:", items);

    if (items.length === 0) {
      this.poItemsData = [
        {
          ItemName: "-",
          Quantity: 0,
          ValidationStatus: "Tidak ada data",
        },
      ];
    } else {
      this.poItemsData = items.map((item) => ({
        ItemName: item.itemName || item.ItemName || "-",
        Quantity: item.quantity || item.Quantity || 0,
        ValidationStatus: isValid ? "Sesuai" : "Tidak Sesuai",
      }));
    }

    console.log("[preparePOItems] poItemsData:", this.poItemsData);
    this.showPOItemsTable = true;
  }

  detached() {
    const table = document.querySelector("table");
    if (table) table.removeEventListener("click", this.onTableClick);
  }

  onTableClick(evt) {
    const btn = evt.target.closest("button[data-action]");
    if (!btn) return;

    const action = btn.getAttribute("data-action");
    const id = btn.getAttribute("data-id");

    if (action === "info") {
      this.showInfo(id);

      const list = Array.isArray(window.listData) ? window.listData : [];
      const row = list.find((x) => String(x.Id) === String(id));

      // ===== ITEMS =====
      if (row && Array.isArray(row.items)) {
        console.log(
          "[DEBUG] itemsData:",
          JSON.stringify(this.itemsData, null, 2),
        );
        if (this.showItemsTable && this.itemsData === row.items) {
          this.showItemsTable = false;
          this.itemsData = [];
        } else {
          this.itemsData = row.items;
          this.showItemsTable = true;
        }
      } else {
        this.itemsData = [];
        this.showItemsTable = false;
      }
      // ===== BON =====
      this.urnsData =
        row && Array.isArray(row.unitReceiptNotes) ? row.unitReceiptNotes : [];
      this.showURNsTable = true;

      // ===== Invoice =====
      // this.invoicesData =
      //   row && Array.isArray(row.invoices) ? row.invoices : [];
      // this.showInvoicesTable = true;

      // ===== PR =====
      this.prsData =
        row && Array.isArray(row.purchaseRequests) ? row.purchaseRequests : [];
      this.showPRsTable = true;

      // ===== PO =====
      this.posData =
        row && Array.isArray(row.purchaseOrders) ? row.purchaseOrders : [];
      this.showPOsTable = true;

      // this.taxData = row && Array.isArray(row.tax) ? row.tax : [];
      // this.showTaxTable = true;
    }
  }

  showInfo(id) {
    const list = Array.isArray(window.listData) ? window.listData : [];
    const row = list.find((x) => String(x.Id) === String(id));
    if (!row) return;
    this.router.navigateToRoute("view", { id: row.Id });
  }

  cancel() {
    if (confirm("Apakah Anda yakin akan kembali?")) {
      this.router.navigateToRoute("list");
    }
  }

  prItemsColumns = [
    { header: "Nama Item", value: "ItemName" },
    { header: "Qty", value: "Quantity" },
    { header: "Validasi", value: "ValidationStatus" },
  ];

  urnItemsColumns = [
    { header: "Nama Item", value: "ItemName" },
    { header: "Qty", value: "Quantity" },
    { header: "Validasi", value: "ValidationStatus" },
  ];
}
