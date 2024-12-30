const express = require('express');
const contactUs = require('../controllers/contactController');

const contactRouter = express.Router();

contactRouter.post('/contact-us', contactUs);

module.exports = contactRouter;