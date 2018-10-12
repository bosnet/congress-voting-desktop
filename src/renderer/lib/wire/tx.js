/* eslint class-methods-use-this: ["error", { "exceptMethods": ["nestedArrays", "fee", "json"] }] */

import moment from 'moment';

export class Op {
  nestedArrays() {
    return [];
  }

  fee() {
    return 0;
  }

  json() {
    return {};
  }
}

export class Tx {
  constructor(sourceAddress, fee, seqId) {
    this.source = sourceAddress;
    this.seqId = seqId || 0;
    this.ops = [];
    this.fee = fee || 0;
    this.signature = null;
  }

  updateFee() {
    return this.ops.map(op => op.fee()).reduce((p, c) => p + c);
  }

  addOp(op) {
    this.ops.push(op);
    this.fee = this.updateFee() || 0;
  }

  updateSignature(signature) {
    this.signature = signature;
  }

  nestedArrays() {
    return [
      this.source,
      this.fee,
      this.seqId,
      this.ops.map(op => op.nestedArrays()),
    ];
  }

  json() {
    return {
      T: 'transaction',
      H: {
        created: moment().format('YYYY-MM-DDTHH:mm:ss.SSSSSSSSSZ'),
        signature: this.signature,
      },
      B: {
        source: this.source,
        fee: this.fee.toString(),
        sequenceID: this.seqId,
        operations: this.ops.map(op => op.json()),
      },
    };
  }
}
