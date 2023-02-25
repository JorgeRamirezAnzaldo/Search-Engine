//Import mongoose
const mongoose = require('mongoose');

//Create database connection for application and configure it
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/googlebooks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //useCreateIndex: true,
  //useFindAndModify: false,
});

//Export mongoose connection
module.exports = mongoose.connection;
