const mongoose=require("mongoose");

const user_schema=mongoose.Schema({
   name:{
    type:String
   },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  img:{
    type:String
  },
  blogs:{
    type:Array,
    default:[]
  }

})

const User=mongoose.model('smit_user',user_schema);
module.exports=User;