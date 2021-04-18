const mongoose = require('mongoose')

mongoose
    .connect('mongodb+srv://root:12345@cluster0.rurv5.mongodb.net/d_coder?retryWrites=true&w=majority', { useNewUrlParser: true })
    .catch(e => {
        console.error('Connection error', e.message)
    })

const db = mongoose.connection

module.exports = db