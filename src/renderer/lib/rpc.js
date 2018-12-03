import axios from 'axios';
import config from '#config';
import dns from 'dns';

const client = axios.create();
const HEADERS = {
  'Content-Type': 'application/json',
};

class RPC {
  constructor({ dnsSeed, endpoint, membership }) {
    this.hosts = [];
    this.dnsSeed = dnsSeed;
    this.endpoint = endpoint;
    this.membershipEndpoint = `${membership.scheme}://${membership.host}:${membership.port}`;
  }

  getAccount(address) {
    return this.lookup()
      .then(endpoint => client.get(`${endpoint}/api/v1/accounts/${address}`))
      .then(res => res.data);
  }

  getMembership(address) {
    return client
      .get(`${this.membershipEndpoint}/api/v1/memberships/${address}`)
      .then(res => res.data);
  }

  getSumsubAccessToken(address) {
    return client
      .get(`${this.membershipEndpoint}/api/v1/memberships/sumsub/access-token/${address}`)
      .then(res => res.data);
  }

  async getFrozenAccounts(address) {
    const endpoint = await this.lookup();
    /* eslint-disable no-underscore-dangle */
    const next = async (accum, url) => {
      const res = await client.get(`${endpoint}${url}`);
      if (!res.data
        || !res.data._embedded
        || !res.data._embedded.records
        || res.data._embedded.records.length < 1
      ) {
        return accum;
      }

      accum._embedded.records = accum._embedded.records.concat(res.data._embedded.records);
      const result = await next(accum, res.data._links.next.href);
      return result;
    };
    const data = await next({ _embedded: { records: [] } }, `/api/v1/accounts/${address}/frozen-accounts?limit=100`);
    /* eslint-enable no-underscore-dangle */
    return data;
  }

  getProposals(state) {
    state = state || 'all';
    return client
      .get(`${this.membershipEndpoint}/api/v1/proposals?state=${state}`)
      .then(res => res.data.data);
  }

  hasVotedForProposal(id, address) {
    return client
      .get(`${this.membershipEndpoint}/api/v1/proposals/${id}/votes/${address}`)
      .then(res => res.data.data);
  }

  isOngoingProposal() {
    return client
      .get(`${this.membershipEndpoint}/api/v1/proposals/ongoing`)
      .then(res => res.data.data);
  }

  getTransaction(hash) {
    return this.lookup()
      .then(endpoint => client
        .get(`${endpoint}/api/v1/transactions/${hash}`))
      .then(res => res.data);
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
    return Promise.resolve(`${this.endpoint.scheme}://${this.dnsSeed}:${this.endpoint.port}`);
  }

  sendTx(tx) {
    return this.lookup()
      .then(endpoint => client
        .post(`${endpoint}/api/v1/transactions`, tx, { headers: HEADERS }));
  }

  vote(proposalId, payload) {
    return client
      .post(`${this.membershipEndpoint}/api/v1/proposals/${proposalId}/vote`, payload, { headers: HEADERS });
  }

  registerPreMembership(payload) {
    return client
      .post(`${this.membershipEndpoint}/api/v1/memberships`, payload, { headers: HEADERS });
  }

  updateApplicantId(address, payload) {
    return client
      .put(`${this.membershipEndpoint}/api/v1/memberships/${address}`, payload, { headers: HEADERS });
  }

  registerMembership(address) {
    return client
      .post(`${this.membershipEndpoint}/api/v1/memberships/${address}/activate`, {}, { headers: HEADERS });
  }

  deregisterMembership(address, signature) {
    return client
      .delete(`${this.membershipEndpoint}/api/v1/memberships/${address}?sig=${signature}`, { headers: HEADERS });
  }
}

const remoteRPC = new RPC({
  dnsSeed: config.get('dns.seed'),
  endpoint: config.get('endpoint'),
  membership: config.get('membership'),
});

export {
  remoteRPC,
  RPC,
};
