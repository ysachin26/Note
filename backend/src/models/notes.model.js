const {Schema, model} = require('mongoose')

const noteSchema = new Schema(
    {
        title:
        {
            type:String,
            required:false,
            maxlength:50,
        }
        ,
        description:
        {
            type:String,
            required:true
        }
    }
)

const noteModel = model('note',noteSchema)
module.export = noteModel;