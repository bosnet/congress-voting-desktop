const express = require('express');
const crypto = require('crypto');
const createError = require('http-errors');
const cors = require('cors');

const router = express.Router({
  strict: true,
});

const txs = {};
const ops = {};
const counters = {
  op: 0,
};
const accounts = {
  // SBIVDDPMMZ2XXMO2O5IN43GNP5UJUHHOW72SPCYSPJQWOR4WWCQM4WUH
  GD5BOF4T67XERMR2QPNAIVG4UJHICELADO753XIADYXUKDCQ75FOH3HP: {
    'address': 'GD5BOF4T67XERMR2QPNAIVG4UJHICELADO753XIADYXUKDCQ75FOH3HP',
    'balance': 99900000000000,
    'linked': '',
    'sequence_id': 1
  },
};

function op(address, hash, source, target, type, amount) {
  ops[address] = ops[address] || [];
  ops[address].push({
    hash,
    source,
    target,
    type,
    amount,
  });
}

router.get('/operations/:hash', cors(), async (req, res) => {
  return res.json({});
});

router.post('/transactions', cors(), async (req, res) => {
  const data = req.body;
  const source = accounts[data.B.source];
  const operations = data.B.operations;

  if (source && operations && operations.length > 0) {
    const amount = operations.map(o => o.B.amount).reduce((a, b) => a + b);
    source.sequence_id += 1;
    source.balance -= data.B.fee + amount;
    for (let i = 0; i < operations.length; i++) {
      const o = operations[i];
      if (o.H.type === 'create-account') {
        accounts[o.B.target] = {
          address: o.B.target,
          balance: o.B.amount,
          linked: o.B.linked,
          sequence_id: 1,
        };
      }

      const b = Buffer.alloc(4);
      b.writeUInt32BE(counters.op++, 0);
      const dummyHash = crypto.createHash('sha256').update(b).digest('hex');
      o.H.hash = dummyHash;
      ops[data.B.source] = ops[data.B.source] || [];
      ops[data.B.source].push(o);
    }
  }
  return res.json({});
});

router.get('/accounts/:address', cors(), async (req, res) => {
  const address = req.params.address;
  return res.json(accounts[address]);
});

router.get('/accounts/:address/operations', cors(), async (req, res) => {
  const address = req.params.address;
  const type = req.query.type;
  const data = {};

  if (type === 'freeze') {
    data['_embedded'] = {
      records: (ops[address] || [])
        .filter(o => o.B.linked && o.B.linked.length > 0)
        .map((o) => {
          return {
            amount: o.B.amount,
            hash: o.H.hash,
            source: o.H.source,
            target: o.B.target,
            type: o.H.type,
          };
        }),
    };
  }
  return res.json(data);
});

module.exports = router;

