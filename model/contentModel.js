const mongoose = require('mongoose')
const Schema = mongoose.Schema

const contentSchema = new Schema({
    title: {type: String, require},
    content: {type: String, require},
    file: {type:String, require},
    name: {type:String, require},
    date: {type:String, require}
})

const Content = mongoose.model('Content', contentSchema)

module.exports = Content