import Ringa from 'ringa';

const RESTModel = Ringa.Model.construct('RESTModel');

/**
 * APIController
 */
export default class RESTController extends Ringa.Controller {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor() {
    super('RESTController', undefined, {
      timeout: 10000
    });

    this.restModel = new RESTModel();
    this.addModel(this.restModel);

    //------------------------------------
    // GET, POST, PUT, DELETE
    //------------------------------------

    let startRequest = (restModel, $detail) => {
      restModel.calls++;
      restModel.activeCalls++;

      if ($detail.credentials) {
        $detail.headers = $detail.headers || {};
        $detail.headers['Authorization'] = `Bearer ${this.appModel.token}`;
      }
    };

    let finRequest = (restModel) => {
      restModel.activeCalls--;
    };

    // APIController.GET
    this.addListener('GET', [
        startRequest,
        ($ringaEvent, url) => {
          let idParam = $ringaEvent.detail.idParam;
          if (idParam && !$ringaEvent.detail[idParam]) {
            throw new Error(`GET Parameter '${idParam}' was not provided on RingaEvent detail!`);
          }

          return this.request({url, type: 'GET', id: $ringaEvent.detail[idParam], headers: $ringaEvent.detail.headers});
        },
        finRequest
    ]);

    // APIController.POST
    this.addListener('POST', [
      startRequest,
      ($ringaEvent, url, bodyParam) => {
        if (!$ringaEvent.detail[bodyParam]) {
          throw new Error(`POST Parameter '${bodyParam}' was not provided on RingaEvent detail!`);
        }

        return this.request({url, type: 'POST', body: $ringaEvent.detail[bodyParam], headers: $ringaEvent.detail.headers});
      },
      finRequest
    ]);

    // APIController.PUT
    this.addListener('PUT', [
      startRequest,
      ($ringaEvent, url, bodyParam) => {
        if (!$ringaEvent.detail[bodyParam]) {
          throw new Error(`PUT Parameter '${bodyParam}' was not provided on RingaEvent detail! `);
        }
        return this.request({url, type: 'PUT', body: $ringaEvent.detail[bodyParam], id: $ringaEvent.detail[bodyParam].id, headers: $ringaEvent.detail.headers});
      },
      finRequest
    ]);

    // APIController.DELETE
    this.addListener('DELETE', [
      startRequest,
      ($ringaEvent, url, idParam) => {
        if (!$ringaEvent.detail[idParam]) {
          throw new Error(`DELETE Parameter '${idParam}' was not provided on RingaEvent detail!`);
        }

        return this.request({url, type: 'DELETE', id: $ringaEvent.detail[idParam], headers: $ringaEvent.detail.headers});
      },
      finRequest
    ]);
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  request(props) {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      let url = `${API_ROOT}${props.url}`;

      if (props.body && props.body.serialize) {
        props.body = props.body.serialize();
      }

      if (props.id) {
        url = `${url}/${props.id}`;
      }

      xhr.open(props.type, url, true);

      xhr.setRequestHeader('Content-type', 'application/json');
      xhr.setRequestHeader('Accept', 'application/json');

      if (props.headers) {
        for (let key in props.headers) {
          xhr.setRequestHeader(key, props.headers[key]);
        }
      }

      xhr.withCredentials = true;

      xhr.onload = () => {
        // console.log('API Reponse:\n', xhr.response);
        if (xhr.status >= 200 && xhr.status < 300) {
          let parsedResponse;

          try {
            parsedResponse = xhr.response ? JSON.parse(xhr.response) : undefined;
          } catch (error) {
            console.error(error);
          }

          resolve(parsedResponse);
        } else if (xhr.status === 401) {
          resolve(JSON.parse(xhr.response));
        } else {
          //TODO: Better handling of other error codes
          try {
            resolve(JSON.parse(xhr.response));
          } catch(e) {
            console.log(e, xhr.response);
          }
        }
      };

      xhr.onerror = (e) => {
        reject(e);
      };

      xhr.send(props.body ? JSON.stringify(props.body) : undefined);
    });
  }
}
