const express = require('express'); 
const app = express();
const http = require('http');
const cors = require('cors');
const {Server} = require('socket.io'); 

app.use(cors()); 
app.get('/', (req, res)=>{
    res.send('This is the backend for the competitive wordle app, access at: https://xxxx')
})

const server = http.createServer(app); 
const io = new Server(server, {
    cors: {
        // origin (frontend in this case) and methods that the socket.io should accept
        //origin: "http://localhost:3000", 
        origins: ["https://henriquewho.github.io/reactWordle", "http://localhost:3000"],
        methods: ["GET", "POST"]
    }
}); 

// socket.io event listener for a connection
io.on("connection", (socket) => {
    // whenever someone connects
    console.log("socket.id connected: ", socket.id); 

    // user creates or join a room
    socket.on("join", (data)=>{
        socket.join(data.room); 
        console.log("join with id: ", socket.id, " room: ", data.room);
    })
    
    // a message is sent to the backend
    socket.on("send", (data)=> {
        console.log("send data: ", data);
        socket.to(data.room).emit("receive", data)
    })

    // whenever someone disconnects
    socket.on("disconnect", ()=>{
        console.log("socket.id disconnected: ", socket.id);
    }); 
});


const PORT = process.env.PORT || 3001; 
server.listen(PORT, () => {
    console.log('Server running on port: ', PORT)
});