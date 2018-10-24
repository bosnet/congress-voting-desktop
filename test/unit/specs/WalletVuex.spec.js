import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import { Keypair } from 'stellar-base';
import { expect } from 'chai';
import Wallet from '@/lib/wallet';
import modules from '@/store/modules';
import unit from '@/lib/unit';
import db from '@/lib/db';
import { remoteRPC as rpc } from '@/lib/rpc';
import BigNumber from "bignumber.js";

const localVue = createLocalVue();
localVue.use(Vuex);

describe('WalletVuex', function () {
  this.timeout(10000);

  const later = (delay, value) => new Promise(resolve => setTimeout(resolve, delay, value));
  const raiseHttpResponse = (e) => {
    throw e.response;
  };
  const Empty = localVue.component('empty', {
    template: '<div></div>',
  });

  let store;
  let address;

  beforeEach(() => {
    address = 'GDIRF4UWPACXPPI4GW7CMTACTCNDIKJEHZK44RITZB4TD3YUM6CCVNGJ';
    store = new Vuex.Store({
      modules,
    });
    return db.delete().then(() => db.open().then(() => db.wallets.add({
      address,
      title: 'My wallet',
      // passphrase : 1234
      data: '5fwjnzGeFruYcQdF42Njd9T2HwfRcPQUnAia5D5WR9AChzwQsP2PJVwPky1c7hKeU2AmukseDvJwGgT2kcrWtqrN',
      ts: 1540276705763,
    })));
  });

  it('should be converted', () => {
    expect('10000000').to.equal(unit.convert(1, 'bos', 'gon'));
  });

  it('should add a wallet', () => {
    const wrapper = shallowMount(Empty, { store, localVue });
    const kp = Keypair.fromSecret('SD2FJIJ65AMJSHQYLZFBNOVOGPMC653CNVZ7PS6HV5RGY5RYQRBALICJ');
    const data = Wallet.encryptWallet('1234', kp.secret());

    return wrapper.vm.$store.dispatch('addWallet', {
      title: 'My wallet : GDW6S..EQZ7',
      address: kp.publicKey(),
      data,
    });
  });

  it('should freeze an account with 10000 bos', async () => {
    const wrapper = shallowMount(Empty, { store, localVue });

    const amount = 1;
    const source = await rpc.getAccount(address);

    return wrapper.vm.$store.dispatch('freeze', {
      address,
      amount,
      passphrase: '1234',
    }).then(data => later(5500, data))
      .then(data => Promise.all([rpc.getAccount(address), rpc.getAccount(data.address)]), raiseHttpResponse)
      .then((data) => {
        const gon = unit.convert(amount, 'bos', 'gon');
        const [sender, receiver] = data;
        expect(new BigNumber(source.balance, 10)
          .minus(gon)
          .minus(10000)
          .toString(10)
        ).to.equal(sender.balance);
        expect(gon).to.equal(receiver.balance);
      });
  });

  it('should answer a proposals', async () => {
    const wrapper = shallowMount(Empty, { store, localVue });

    return wrapper.vm.$store.dispatch('vote', {
      address,
      proposalId: 1,
      answer: 'yes',
      passphrase: '1234',
    });
    // TODO
  });
});
