import argon2 from 'argon2-browser';
import registerPromiseWorker from 'promise-worker/register';

registerPromiseWorker((data) => {
  if (!data) {
    return Promise.reject(data);
  }
  const message = data[0];
  const args = data[1];
  if (message === 'argon2') {
    return argon2.hash({
      salt: args.salt,
      pass: args.bytes,
      time: 3,
      mem: 1024 * 32,
      hashLen: 32,
      parallelism: 4,
      type: argon2.ArgonType.Argon2i,
      distPath: '/static/js/argon2-browser',
    }).then(res => res.hash);
  }

  return Promise.reject(data);
});
