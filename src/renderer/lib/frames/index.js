import FreezeAccountOp from './freeze';
import Tx from './tx';

export default {
  createFreezeAccountTx(sourceAddress, amount, seqId, destinationAddress) {
    const tx = new Tx(sourceAddress, seqId);
    tx.addOp(new FreezeAccountOp(destinationAddress, amount, sourceAddress));
    return tx;
  },
};
