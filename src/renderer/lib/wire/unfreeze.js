import { Op } from './tx';

export default class UnfreezeAccountOp extends Op {
  nestedArrays() { // eslint-disable-line class-methods-use-this
    return [
      ['unfreezing-request'],
      [],
    ];
  }

  json() { // eslint-disable-line class-methods-use-this
    return {
      H: {
        type: 'unfreezing-request',
      },
      B: {},
    };
  }
}
