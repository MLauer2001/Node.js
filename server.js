// run server with: nodemon ./server.js

var express = require('express');
var bodyParser = require('body-parser')
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

var Message = mongoose.model('Message',{
    name : String,
    message : String
})

// Database
var dbUrl = 'mongodb+srv://mlauer2001:JrvT1kFS5kVP98lv@chatroomdb.thjvh9q.mongodb.net/simple-chat?w=majority';


// Get
app.get('/messages', (req, res) => {
  Message.find({},(err, messages)=> {
    res.send(messages);
  })
})

// Get User
app.get('/messages/:user', (req, res) => {
  var user = req.params.user
  Message.find({name: user},(err, messages)=> {
    res.send(messages);
  })
})

// Post
app.post('/messages',(req, res) =>{
    var message = new Message(req.body);
    message.save((err) =>{
        if(err)
            res.sendStatus(500);
        io.emit('message', req.body);
        res.sendStatus(200);
    })
})

// Check for connection
io.on('connection', () =>{
  console.log('a user is connected')
})

// Connect to DB
mongoose.connect(dbUrl,(err) => {
    console.log('mongodb connected',err);
  })

// Open Server
var server = http.listen(3000, () => {
  console.log('server is running on port', server.address().port);
});