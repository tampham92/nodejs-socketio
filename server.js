const express = require('express')
const app = express()
app.use(express.static('public'))

//View teamplate ejs
app.set('view engine', 'ejs')
app.set('views', './views')

const server = require('http').Server(app)
const delay = require('delay')
//socket io
var arrAayUser = []
const io = require('socket.io')(server)
io.on('connection', (socket)=>{
    console.log('Con nguoi ket noi', socket.id)

    //Server listen user register
    socket.on('client-send-User', function(data){
        if(arrAayUser.indexOf(data)>=0){
            //That bai
            socket.emit('server-send-register-fail')
        } else{
            //thanh cong
            arrAayUser.push(data)
            socket.username = data
            socket.emit('server-send-register-success', data)
            io.sockets.emit('server-send-list-Users', arrAayUser)
        }
        //Logout
        socket.on('logout', function(){
            arrAayUser.splice(
                arrAayUser.indexOf(socket.username), 1
            )
            socket.broadcast.emit('server-send-list-Users', arrAayUser)
        })

        //Chat
        socket.on('user-send-mssg', function(data){
            io.sockets.emit('server-send-mssg', { username:socket.username, mssg:data })
        })
        
        socket.on('user-typing', function(data){
            var someOne = socket.username + ' Đang viết'
            io.sockets.emit('some-one-typing', someOne )
        })
        socket.on('user-stop-typing', function(){
            io.sockets.emit('some-one-stop-typing')
        })
    })
})

async function broadcastUSD(){
    while (true){
        const usd = 22 + Math.random() * 2
        // console.log(usd)
        io.emit('usd-price', parseFloat(usd.toFixed(3)))
        await delay(1000)
    }   
}
broadcastUSD()

server.listen(3000, function(){
    console.log('App listening')
})



app.get('/', (req, res, netx) => {
    res.render('home')
})