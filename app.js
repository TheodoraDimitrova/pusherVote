const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");


require('./config/db')

const app = express();
const vote=require('./routes/vote')

//public folder
app.use(express.static(path.join(__dirname, "public")));

//body parser middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Enable CORS
app.use(cors());

app.use('/vote',vote)

const port = 9000;

//start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
