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
  constructor(sourceAddress, seqId) {
    this.source = sourceAddress;
    this.seqId = seqId;
    this.ops = [];
    this.fee = 0;
    this.signature = null;
  }

  updateFee() {
    return this.ops.map(op => op.fee()).reduce((p, c) => p + c);
  }

  addOp(op) {
    this.ops.push(op);
    this.fee = this.updateFee();
  }

  updateSignature(signature) {
    this.signature = signature;
  }

  nestedArrays() {
    return [
      this.source,
      this.fee,
      this.seqId,
      this.ops,
    ];
  }

  json() {
    return {
      T: 'transaction',
      H: {
        created: moment().toISOString(),
        signature: this.signature,
      },
      B: {
        source: this.source,
        fee: this.fee,
        sequenceID: this.seqId,
        operations: this.ops.map(op => op.json()),
      },
    };
  }
}
