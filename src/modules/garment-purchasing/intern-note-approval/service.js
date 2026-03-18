import { RestService } from '../../../utils/rest-service';


const serviceUri = 'garment-intern-notes';
const invoiceNoteUri = 'garment-invoices/no-intern-note';

class Service extends RestService {

     constructor(http, aggregator, config, endpoint) {
        super(http, aggregator, config, "purchasing-azure");
    }

    search(info) {
        var endpoint = `${serviceUri}`;
        return super.list(endpoint, info);
    }

    getById(id) {
        var endpoint = `${serviceUri}/${id}`;
        return super.get(endpoint);
    }

   
    getPdfById(id) {
        var endpoint = `${serviceUri}/pdf/${id}`;
        return super.getPdf(endpoint);
    }


    replace(id, data) {
        var endpoint = `${serviceUri}/${id}`;
        return super.patch(endpoint, data);
    }
    
    Rejected(id, reason) {
    let endpoint = `${serviceUri}/intern-note-rejected/${id}`;
    let body = { Reason: reason };
    return super.put(endpoint, body);
  }

};

export { Service }
