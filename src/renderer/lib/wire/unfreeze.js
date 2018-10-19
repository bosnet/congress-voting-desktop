import { Op } from './tx';

export default class UnfreezeAccountOp extends Op {
  nestedArrays() { // eslint-disable-line class-methods-use-this
    return [
      ['unfreeze'],
      [],
    ];
  }

  json() { // eslint-disable-line class-methods-use-this
    return {
      H: {
        type: 'unfreeze',
      },
      B: {},
    };
  }
}
