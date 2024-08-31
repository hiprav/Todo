const mongoose = require('mongoose')
const Schema=mongoose.Schema;

const todoSchema=new Schema({
    title:{type:String, },
    content:{type:String, },
    done:{type:Boolean, default: false},
    userId:{type:String, required: true},
})

module.exports=mongoose.model('todo',todoSchema);