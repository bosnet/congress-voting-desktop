import { Op } from './tx';

export default class PaymentOp extends Op {
  constructor(target, amount) {
    super();
    this.target = target;
    this.amount = amount;
  }

  nestedArrays() {
    return [
      ['payment'],
      [
        this.target,
        this.amount,
      ],
    ];
  }

  json() {
    return {
      H: {
        type: 'payment',
      },
      B: {
        target: this.target,
        amount: this.amount,
      },
    };
  }
}
