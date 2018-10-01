import BigNumber from 'bignumber.js';

const units = {
  gon: '1',
  bos: '10000000',
};

export default {
  convert(value, from, to) {
    return new BigNumber(value, 10)
      .multipliedBy(units[from], 10)
      .dividedBy(units[to], 10)
      .toString(10);
  },
};
