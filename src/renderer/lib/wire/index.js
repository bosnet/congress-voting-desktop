import FreezeAccountOp from './freeze';
import UnfreezeAccountOp from './unfreeze';
import PaymentOp from './payment';
import VoteOp from './vote';
import { Tx } from './tx';

export default {
  createPaymentTx(sourceAddress, amount, fee, seqId, targetAddress) {
    const tx = new Tx(sourceAddress, fee, seqId);
    tx.addOp(new PaymentOp(targetAddress, amount));
    return tx;
  },

  createFreezeAccountTx(sourceAddress, amount, fee, seqId, targetAddress) {
    const tx = new Tx(sourceAddress, fee, seqId);
    tx.addOp(new FreezeAccountOp(targetAddress, amount, sourceAddress));
    return tx;
  },

  createUnfreezeRequestTx(sourceAddress, fee, seqId) {
    const tx = new Tx(sourceAddress, fee, seqId);
    tx.addOp(new UnfreezeAccountOp());
    return tx;
  },

  createVoteOp(sourceAddress, proposalId, answer) {
    const tx = new Tx(sourceAddress);
    tx.addOp(new VoteOp(proposalId, answer));
    return tx;
  },
};
