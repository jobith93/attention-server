// Express - app JS
// Attentio - Chrome Extension to Grab your team-mate's attention
// Author - Jobith <jobithmbasheer@gmail.com>

var express = require('express')
var http = require("http")
var app = express()
var cors = require('cors')

// data
var users = require('./data/users.json')


// enable cors
app.use(cors())

// Socket connection
/* Creates new HTTP server for socket */
var socketServer = http.createServer(app)
var io = require('socket.io')(socketServer)

/* Listen for socket connection on port 3002 */
socketServer.listen(3002, function(){
    console.log('Socket server listening on : 3002')
});

/* This event will emit when client connects to the socket server */
io.on('connection', function(socket){

    console.log(`Client connected  ✅`)

    // Receive ping event with data:
    socket.on('ping user', function(data) {
        console.log(`${data.sender} wants to ping ${data.receiver}`)
        let sender = users.find((user) => user.username == data.sender)
        let receiver = users.find((user) => user.username == data.receiver)
        
        io.emit('ping user', {
            sender,
            receiver
        });
    });
    

    socket.on('disconnect', function(){
        console.log('Socket is disconnected ❌')
    })
})




/* Create HTTP server for node application */

var server = http.createServer(app)
app.use('/static', express.static('public'))

app.get('/', (req, res) => {
    res.json(`${req.protocol}://${req.headers.host}`)
})

// GET request for all users
app.get('/users', (req, res) => {
    users.forEach((user) => {
        user.profile_picture = `${req.protocol}://${req.headers.host}/static/images/${user.image}`
    })
    res.json(users);
})

/* Node application will be running on 3000 port */
server.listen(3000)