import { Op } from './tx';

export default class FreezeAccountOp extends Op {
  constructor(target, amount, linked) {
    super();
    this.target = target;
    this.amount = amount;
    this.linked = linked;
  }

  nestedArrays() {
    return [
      ['create-account'],
      [
        this.target,
        this.amount,
        this.linked,
      ],
    ];
  }

  json() {
    return {
      H: {
        type: 'create-account',
      },
      B: {
        target: this.target,
        amount: this.amount,
        linked: this.linked,
      },
    };
  }
}
