
import { inject, customElement } from 'aurelia-framework';
import { Service } from '../service';


@customElement('compare-doc-ai')
@inject(Service)
export class CompareDocAi {
  constructor(service) {
    this.service = service;
  }

  search = '';
  searchResults = [];
  loading = false;
  showDropdown = false;
  selectedNotaIntern = null;

  async onSearchInput(event) {
    this.search = event.target.value;
    if (this.search && this.search.length > 1) {
      this.loading = true;
      this.showDropdown = true;
      try {
        const result = await this.service.searchInternNotes({ keyword: this.search, page: 1, size: 10 });
        this.searchResults = (result.data || []);
      } catch (e) {
        this.searchResults = [];
      }
      this.loading = false;
    } else {
      this.searchResults = [];
      this.showDropdown = false;
    }
  }

  selectNI(ni) {
    this.selectedNotaIntern = ni;
    this.search = ni.inNo;
    this.showDropdown = false;
  }

  searchAction() {
    if (this.selectedNotaIntern) {
      alert(`NI: ${this.selectedNotaIntern.inNo}\nId: ${this.selectedNotaIntern.Id}`);
    }
  }
}
