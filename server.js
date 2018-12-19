const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');
const app = express();
const db = require('./config/keys').mongoURI;

//Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//

//connect to mongoDB
mongoose
  .connect(
    db,
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB connected..'))
  .catch(e => console.log(e));
//

//Passport middleware

app.use(passport.initialize());
require('./config/passport')(passport);
//

// pin files to according routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);
//
//serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  //set static folderr
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server up on ${port}..`));
