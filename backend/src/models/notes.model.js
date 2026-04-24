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
        // Set when a note moves to bin. TTL index uses this for auto-deletion.
        binAt: {
            type: Date,
            default: null,
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

//MongoDB requires a text index for $text queries.
noteSchema.index({title:'text',description:'text'})

// Auto-delete notes 30 days after they are moved to bin.
noteSchema.index(
    { binAt: 1 },
    {
        expireAfterSeconds: 60 * 60 * 24 * 30,
        partialFilterExpression: { isBin: true }
    }
)

const noteModel = model('note', noteSchema)
module.exports = noteModel;