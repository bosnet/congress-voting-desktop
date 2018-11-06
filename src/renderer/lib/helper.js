import BigNumber from 'bignumber.js';

export default {
  isValidPassphrase(input) {
    const passwordRule = new RegExp('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()\\-_=+[\\]{}\\,.<>?])[A-Za-z\\d!@#$%^&*()\\-_=+[\\]{}\\,.<>/?]{12,}$');
    return passwordRule.test(input);
  },
  copyToClipboard(elem) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(elem);
    selection.removeAllRanges();
    selection.addRange(range);
    document.execCommand('copy');
    selection.removeAllRanges();
  },
  fineMinimumFreezeAmount(amount, fee) {
    const caculated = new BigNumber(amount, 10)
      .minus(fee, 10)
      .dividedBy(10000, 10).toFixed(0);

    return new BigNumber(caculated, 10)
      .multipliedBy(10000, 10)
      .toString(10);
  },
  sumAmount(left, right) {
    return new BigNumber(left, 10)
      .plus(right, 10)
      .toString(10);
  },
};
