import { bindable } from 'aurelia-framework';

export class ScanResultData {
	@bindable result; // hasil JSON lengkap (response.json())

	activate(model) {
		if (model && 'result' in model) {
			this.result = model.result;
		}
		this._extract();
	}

	bind() {
		this._extract();
	}

	resultChanged() {
		this._extract();
	}

	_extract() {
		// Robust extraction: handle various possible shapes/cases
		const root = this.result ? (this.result.data || this.result.Data || this.result) : null;
		let invoice = null;
		if (root) {
			invoice = root.Invoice || root.invoice || root.InvoiceResult || (root.Result && root.Result.Invoice) || null;
		}
		// Some services may put Header/Items at root level
		const headerCandidate = (invoice && (invoice.Header || invoice.header)) || (root && (root.Header || root.header)) || null;
		const itemsCandidate = (invoice && (invoice.Items || invoice.items || invoice.Lines || invoice.lines)) || (root && (root.Items || root.items)) || [];

		this.header = headerCandidate || null;
		this.items = Array.isArray(itemsCandidate) ? itemsCandidate : [];

		// Default: items hidden until user clicks toggle button
		this.showItems = false;

	// Build au-table data/columns
	this._buildTables();
	}

	_buildTables() {
		const self = this;
		// Data arrays for au-table
		this.headerData = this.header ? [this.header] : [];

		// Common table options: disable features we don't need
		this.tableOptions = {
			pagination: false,
			search: false,
			showColumns: false,
			showToggle: false,
			pageSize: 50,
			locale: 'id-ID'
		};

		// Header columns with last col as toggle button
		this.headerColumns = [
			{ field: 'InvoiceNumber', title: 'Nomor Invoice' },
			{ field: 'InvoiceDate', title: 'Tanggal Invoice', formatter: (v) => self.formatDate(v) },
			{ field: 'GrandTotalBeforeTax', title: 'DPP', align: 'right', formatter: (v) => self.formatNumber(v) },
			{ field: 'ValueAddedTax', title: 'PPN', align: 'right', formatter: (v) => self.formatNumber(v) },
			{ field: 'IncomeTax', title: 'PPH', align: 'right', formatter: (v) => self.formatNumber(v) },
			{ field: 'GrandTotalAfterTax', title: 'Grand Total', align: 'right', formatter: (v) => self.formatNumber(v) },
			{ field: 'Currency', title: 'Mata Uang' },
			{
				field: '__toggle', title: '', align: 'center', width: 60,
				formatter: () => '<button class="btn btn-info btn-sm toggle-items">i</button>',
				events: {
					'click .toggle-items': function (e) { try { if (e) { e.preventDefault(); e.stopPropagation(); } } catch(_) {} self.toggleItems(); }
				}
			}
		];

	// Item columns now defined inside scan-result-item component
	}

	get hasHeader() {
		return !!this.header;
	}
	get hasItems() {
		return Array.isArray(this.items) && this.items.length > 0;
	}

	toggleItems() {
		if (!this.hasItems) return;
		this.showItems = !this.showItems;
	}

	formatNumber(v) {
		if (v == null) return '';
		const n = Number(v);
		if (isNaN(n)) return v;
		return n.toLocaleString('id-ID', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
	}

	formatDate(v) {
		if (!v) return '';
		const d = new Date(v);
		if (isNaN(d)) return v;
		const dd = String(d.getDate()).padStart(2, '0');
		const mm = String(d.getMonth() + 1).padStart(2, '0');
		const yy = d.getFullYear();
		return `${dd}-${mm}-${yy}`;
	}
}

export default ScanResultData;
