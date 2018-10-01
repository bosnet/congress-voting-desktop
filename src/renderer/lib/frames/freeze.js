import { Op } from './tx';

export default class FreezeAccountOp extends Op {
  constructor(destination, amount, linked) {
    super();
    this.destination = destination;
    this.amount = amount;
    this.linked = linked;
  }

  nestedArrays() {
    return [
      ['create-account'],
      [
        this.destination,
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
        target: this.destination,
        amount: this.amount,
        linked: this.linked,
      },
    };
  }
}
