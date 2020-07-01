const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const redis = require('redis');
const client = redis.createClient({
  host : 'redis-server',
  port : 6379
});

client.set('visits',0);

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose
  .connect(
    'mongodb+srv://goyalaadesh461:11710461Aa@test-d3lnu.mongodb.net/<dbname>?retryWrites=true&w=majority',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const Item = require('./models/Item');

app.get('/', (req, res) => {
  var visit = 0;
  client.get('visits',function(err,visits){
     visit = visits;
     client.set('visits',parseInt(visits)+1);
  });
  console.log(visit);
  Item.find()
    .then(items => res.render('index', { items , visit}))
    .catch(err => res.status(404).json({ msg: 'No items found' }));
});

app.post('/item/add', (req, res) => {
  const newItem = new Item({
    name: req.body.name
  });

  newItem.save().then(item => res.redirect('/'));
});

const port = 4000;

app.listen(port, () => console.log('Server running...'));
