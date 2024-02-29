const express = require('express');
const router = express.Router(); 
const { createGroup } = require('../controllers/groupController');

router.route('/createGroup').post(createGroup);

module.exports= router;