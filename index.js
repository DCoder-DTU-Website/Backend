const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const db = require('./db')
const projectRouter = require('./routes/project-router')
const eventRouter = require('./routes/event-router')
const lectureRouter = require('./routes/lecture-router')

const app = express()
const apiPort = 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.json())

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

app.get('/', (req, res) => {
    res.send('Hello World!')

})

app.use('/api', projectRouter)
app.use('/api', eventRouter)
app.use('/api', lectureRouter)

app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`))