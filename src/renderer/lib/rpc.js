import axios from 'axios';
import config from 'config';
import dns from 'dns';

const client = axios.create();
const HEADERS = {
  'Content-Type': 'application/json',
};

class RPC {
  constructor({ dnsSeed, endpoint }) {
    this.hosts = [];
    this.dnsSeed = dnsSeed;
    this.endpoint = endpoint;
  }

  getAccount(address) {
    return this.lookup()
      .then(endpoint => client
        .get(`${endpoint}/api/v1/accounts/${address}`)
        .then(res => res.data));
  }

  loadHosts() {
    if (this.hosts && this.hosts.length > 0) {
      return Promise.resolve(this.hosts);
    }

    return new Promise((resolve, reject) => dns.lookup(this.dnsSeed, { all: true }, (e, hosts) => {
      if (e != null) {
        this.hosts = hosts;
        reject(e);
      } else {
        resolve(hosts.filter(h => h.family === 4).map(h => h.address));
      }
    }));
  }

  lookup() {
    return this.loadHosts()
      .then((hosts) => {
        const host = hosts[Math.floor(Math.random() * hosts.length)];
        return `${this.endpoint.scheme}://${host}:${this.endpoint.port}`;
      });
  }

  sendTx(tx) {
    return this.lookup()
      .then(endpoint => client
        .post(`${endpoint}/api/v1/transactions`, tx, { headers: HEADERS })
        .then(res => res.data));
  }
}

const remoteRPC = new RPC({
  dnsSeed: config.get('dns.seed'),
  endpoint: config.get('endpoint'),
});

export {
  remoteRPC,
  RPC,
};