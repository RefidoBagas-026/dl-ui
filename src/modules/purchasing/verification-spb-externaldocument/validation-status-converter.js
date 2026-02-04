export class ValidationStatusValueConverter {
  toView(value) {
    if (!value) return '';
    
    if (value === 'Sesuai') {
      return `<span style="color: #28a745; font-weight: bold;">${value}</span>`;
    } else if (value === 'Tidak Sesuai') {
      return `<span style="color: #dc3545; font-weight: bold;">${value}</span>`;
    } else {
      return `<span style="color: #6c757d;">${value}</span>`;
    }
  }
}
