// View-model placeholder for invoice item details
// Hanya mendefinisikan kolom detail sesuai permintaan, tanpa HTML

export class InvoiceItemDetail {
	// Kolom untuk tabel detail
	detailsColumns = [
	{ header: "Kode Barang", value: "ItemId" },
	{ header: "Nama Barang", value: "ItemName" },
	{ header: "Quantity", value: "Quantity" },
	{ header: "Harga Per Item", value: "UnitPrice" },
	{ header: "Total", value: "LineAmount" }
	];

		activate(model) {
			this.model = model || {};
		}
}

