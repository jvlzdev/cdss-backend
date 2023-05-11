require('dotenv').config();

const mongoose = require('mongoose');

const connectionStr = "mongodb+srv://jvlzdev:12332112@lofidev.67dlsq0.mongodb.net/doer";

mongoose.connect(connectionStr, {useNewUrlparser: true})
.then(() => console.log('connected to mongodb'))
.catch(err => console.log(err))

mongoose.connection.on('error', err => {
  console.log(err)
})
