const express = require('express');
const createError = require('http-errors');
const cors = require('cors');

const router = express.Router({
  strict: true,
});

const users = {
  // SBIVDDPMMZ2XXMO2O5IN43GNP5UJUHHOW72SPCYSPJQWOR4WWCQM4WUH
  GD5BOF4T67XERMR2QPNAIVG4UJHICELADO753XIADYXUKDCQ75FOH3HP: {
    public_address: 'GD5BOF4T67XERMR2QPNAIVG4UJHICELADO753XIADYXUKDCQ75FOH3HP',
    applicant_id: 1,
    status: 'pending',
  }
};

const proposals = [
  {
    title: 'PF-00',
  },
];

router.get('/-/memberships/:address', async (req, res) => {
  const address = req.params.address;
  const user = users[address] || {};
  users[address] = {
    public_address: address,
    applicant_id: user['applicant_id'] || req.query.applicant_id,
    status: user['status'] || req.query.status,
  };
  return res.json(users[address]);
});

router.get('/proposals', cors(), async (req, res) => {
  return res.json(proposals);
});

router.get('/memberships/:address', cors(), async (req, res) => {
  const address = req.params.address;
  if (users[address]) {
    return res.json(users[address]);
  } else {
    return res.status(404).json({});
  }
});

module.exports = router;

