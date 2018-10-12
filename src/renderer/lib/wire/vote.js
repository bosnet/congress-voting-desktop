import { Op } from './tx';

export default class VoteOp extends Op {
  constructor(proposalId, answer) {
    super();
    this.proposalId = proposalId;
    this.answer = answer;
  }

  nestedArrays() {
    return [
      ['vote'],
      [
        this.proposalId,
        this.answer,
      ],
    ];
  }
}
