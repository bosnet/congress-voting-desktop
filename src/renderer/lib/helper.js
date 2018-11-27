import BigNumber from 'bignumber.js';
import axios from 'axios';
import config from '#config';

const client = axios.create();
const checkupUrl = config.get('checkup');

export default {
  isValidPassphrase(input) {
    const passwordRule = new RegExp('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[!@#$%^&*()\\-_=+[\\]{}\\,.<>?])[A-Za-z\\d!@#$%^&*()\\-_=+[\\]{}\\,.<>/?]{8,}$');
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
  calcMinimumFreezeAmount(amount) {
    const calculated = new BigNumber(amount, 10)
      .minus(5000, 10)
      .dividedBy(10000, 10)
      .toFixed(0);

    return new BigNumber(calculated, 10)
      .multipliedBy(10000, 10)
      .toString(10);
  },
  sumAmount(left, right) {
    return new BigNumber(left, 10)
      .plus(right, 10)
      .toString(10);
  },
  async checkup() {
    try {
      const res = await client.get(`${checkupUrl}?ts=${(new Date()).getTime()}`);
      if (res.data.start_time && res.data.end_time) {
        const start = new Date(res.data.start_time);
        const end = new Date(res.data.end_time);
        const now = new Date();
        if (start < now && now < end) {
          return true;
        }
      }
      return false;
    } catch (e) {
      return false;
    }
  },
};
