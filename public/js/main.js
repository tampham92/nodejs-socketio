var socket = io("http://localhost:3000/")
//That bai
socket.on('server-send-register-fail', function(){
    alert('Ten tai khoan da ton tai')
})

//Thanh cong
socket.on('server-send-register-success', function(data){
    $('#currnetUser').html(data)
    $('#loginFrom').hide(2000)
    $('#chatForm').show(1000)
})

//View all user
socket.on('server-send-list-Users', function(data){
    $('#boxContent').html("")
    data.forEach(function(e){
        $('#boxContent').append(`
           <div class="user">${e}</div>
        `)

    })
})

//Noi dung chat
socket.on('server-send-mssg', function(data){
    $('#listMssg').append(`<div class='ms'> ${data.username}: ${data.mssg} </div>`)
})

socket.on('some-one-typing', function(data){
    $('#thongBao').html(`<img src="./img/typing.gif" width="20px" alt="">  ` + data)
})
socket.on('some-one-stop-typing', function(){
    $('#thongBao').html("")
})

let lastPrice = 0
socket.on('usd-price', function(data){
    const price = data
    if(price > lastPrice){
        $('#price-usd').css('color', 'green')
    } else{
        $('#price-usd').css('color', 'red')
    }
    lastPrice = price
    
    $('#price-usd').html(`Tỉ Giá: ${price} USD`)
})

$(document).ready(function(){
    $('#loginFrom').show()
    $('#chatForm').hide()

    $('#btnRegister').click(function(){
        socket.emit('client-send-User', $('#txtUsername').val())
    })

    $('#btnLogout').click(function(){
        socket.emit("logout")
        $('#loginFrom').show(2000)
        $('#chatForm').hide(1000)
    })

    $('#btnSenMssg').click(function(){
        socket.emit('user-send-mssg', $('#textMssg').val())
    })

    //Thong bao go chu
    $('#textMssg').focusin(function(){
        socket.emit('user-typing')
    })
    $('#textMssg').focusout(function(){
        socket.emit('user-stop-typing')
    })
})