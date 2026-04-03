//@ts-check
const {Schema, model} = require('mongoose')

const noteSchema = new Schema(
    {
        userId:
        {
            type:Schema.Types.ObjectId,
            ref:'user',
            required:true
        },
        isPinned:
        {
            type:Boolean,
            default:false,
        },
        isArchived:
        {
            type:Boolean,
            default:false,
        },
        isImportant:
        {
            type:Boolean,
            default:false,
        },
        isBin:{
            type:Boolean,
            default:false,
        },
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
        
    },
    {
        timestamps:true
    }
)

const noteModel = model('note', noteSchema)
module.exports = noteModel;