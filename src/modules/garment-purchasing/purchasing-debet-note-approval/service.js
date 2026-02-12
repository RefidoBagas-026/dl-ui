import { RestService } from '../../../utils/rest-service';


const serviceUri = 'garment-debet-note';

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

    replace(id, data) {
        var endpoint = `${serviceUri}/${id}`;
        return super.patch(endpoint, data);
    }
    
    Rejected(id, reason) {
    let endpoint = `${serviceUri}/debet-note-rejected/${id}`;
    let body = { Reason: reason };
    return super.put(endpoint, body);
  }

};

export { Service }
