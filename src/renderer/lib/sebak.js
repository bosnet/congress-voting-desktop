import axios from 'axios';
import config from 'config';
import dns from 'dns';

import { Tx } from './frames/tx';
import FreezeAccountOp from './frames/freeze';

const client = axios.create();

class Sebak {
  constructor({ dnsSeed, endpoint }) {
    this.hosts = [];
    this.dnsSeed = dnsSeed;
    this.endpoint = endpoint;
  }

  static createFreezeAccountTx(sourceAddress, amount, seqId, destinationAddress) {
    const tx = new Tx(sourceAddress, seqId);
    tx.addOp(new FreezeAccountOp(destinationAddress, amount, sourceAddress));
    return tx;
  }

  getAccount(address) {
    return this.lookup()
      .then(host => client
        .get(`${this.endpoint.scheme}://${host}:${this.endpoint.port}/api/v1/accounts/${address}`)
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
      .then(hosts => hosts[Math.floor(Math.random() * hosts.length)]);
  }
}

const instance = new Sebak({
  dnsSeed: config.get('dns.seed'),
  endpoint: config.get('endpoint'),
});

export {
  instance,
  Sebak,
};
