const express = require('express')

const EventCtrl = require('../controllers/event-ctrl')

const router = express.Router()

router.post('/event/add', EventCtrl.createEvent)
router.get('/event/all', EventCtrl.getEvents)
router.get('/event/:id', EventCtrl.getEventById)

module.exports = router