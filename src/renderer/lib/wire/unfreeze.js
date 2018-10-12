import { Op } from './tx';

export default class UnfreezeAccountOp extends Op {
  constructor(destination) {
    super();
    this.destination = destination;
  }

  nestedArrays() {
    return [
      ['unfreeze'],
      [
        this.destination,
      ],
    ];
  }

  json() {
    return {
      H: {
        type: 'unfreeze',
      },
      B: {
        target: this.destination,
      },
    };
  }
}
