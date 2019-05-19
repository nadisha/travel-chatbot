'use strict'

const express = require('express');
const router = express.Router();

const Chatbot = require('./chatbot/chatbot.controller')

router.post('/api/ask', Chatbot.getAnswer);

module.exports = router;