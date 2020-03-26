const mongoose = require("mongoose");
const keys= require('./keys')

mongoose.Promise=global.Promise
mongoose
  .connect(keys.mongoURI,{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
