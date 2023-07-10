const mongoose =require('mongoose')

const productSchema= new mongoose.Schema({

name:{
    type: String,
    require: [true , 'Please provide product name'],
    trim: true,
    maxlength: [120, "provide name less than 120"]
},
price:{
    type: Number,
    require: [true , 'Please provide product price'],
    maxlength: [6, "provide name less than 6 digits"]
},
description:{
    type: String,
    require: [true , 'Please provide product description'],
}
,
photos:[
    {
        id : {
            type : String,
            required : true
        },
        secure_url : {
            type : String,
            required : true
        }
    }
]
,
catogory:{
    type: String,
    require: [true , 'Please provide product category - from long selves , short ,hoodies , sweters'],
    enum:{
        values: [
            'shortsleeves',
            'longsleeves',
            'sweatshirt',
            'hoodies'
        ],
        message: "please select categorieze"
    }

},
brand:{
    type: String,
    require: [true, "Please provide a brand for cloths"]
},
rating:{
    type:Number,
    default: 0
},
numberReviews:{
    type: Number,
    default: 0
},
reviews:[{
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required:true
    },
    name:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        required:true
    },
    comment:{
        type: Number,
        required: true
    }
}],

user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true

}
,
createdAt:{
    type: Date,
    default: Date.now
}
})


module.exports= mongoose.model('product' , productSchema)