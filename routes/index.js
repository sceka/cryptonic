const bcrypt = require('bcrypt');
const express = require('express');
const router = require('express').Router();
const authInvestor = require('./auth/index');

router.use('/investor', authInvestor);

module.exports = router;
