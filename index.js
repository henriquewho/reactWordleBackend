const express = require('express'); 
const app = express();
const http = require('http');
const cors = require('cors');
const {Server} = require('socket.io'); 

app.use(cors()); 
app.get('/', (req, res)=>{
    res.send('Hello, this is the backend for the competitive wordle app, access at: https://xxxx')
})

const server = http.createServer(app); 
const io = new Server(server, {
    cors: {
        // origin (frontend in this case) and methods that the socket.io should accept
        //origin: "http://localhost:3000", 
        origins: ["https://henriquewho.github.io/reactWordle", "http://localhost:3000", 
        "http://localhost:3001", "http://localhost:3002", "http://localhost:3003"],
        methods: ["GET", "POST"]
    }
}); 

// socket.io event listener for a connection
io.on("connection", (socket) => {

    // user creates or join a room
    socket.on("join", (data)=>{

        let users = io.sockets.adapter.rooms.get(data.room);
        if (!users) {
            // first player to join
            socket.join(data.room); 
            console.log("join with id: ", socket.id, " room: ", data.room);
        }
        else if (users.size<2) {
            // second player to join
            socket.join(data.room); 
            socket.to(data.room).emit("receiveOtherPlayer", {msg: "second player joined"})
            console.log("join with id: ", socket.id, " room: ", data.room);
        } else {
            // cant connect, two users already in the room
            socket.to(data.room).emit("receiveOtherPlayer", {msg: "cant connect"})
            console.log('cant connect, two users already in the room')
        }
    })

    socket.on('setCorrectWord', (data)=>{
        socket.to(data.room).emit('setCorrectWord', data);  
    })

    // whenever someone disconnects
    socket.on("disconnect", ()=>{
        console.log("socket.id disconnected: ", socket.id);
    }); 


    /* 
    // a message is sent to the backend
    socket.on("send", (data)=> {
        console.log("send data: ", data);
        socket.to(data.room).emit("receive", data)
    })

    socket.on("sendWord", (data)=> {
        console.log("send data: ", data);
        socket.to(data.room).emit("receiveWord", data)
    })

    socket.on("wonGame", data => {
        socket.to(data.room).emit("wonGame", data)
    })

    socket.on("drewGame", data => {
        socket.to(data.room).emit("drewGame", data)
    })

    socket.on("update", data => {
        socket.to(data.room).emit("update", data)
    })

    */

    
});


const PORT = process.env.PORT || 3004; 
server.listen(PORT, () => {
    console.log('Server running on port: ', PORT)
});