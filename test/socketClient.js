/**
 * Created with JetBrains WebStorm.
 * User: harinaths
 * Date: 4/1/14
 * Time: 6:48 PM
 * To change this template use File | Settings | File Templates.
 */


var io = require('socket.io-client');
var socket = io.connect('http://0.0.0.0:3000/');
socket.on('connect', function () {
    // socket connected
    console.log(' Socket Connected ');

    socket.emit('join', 'R1');
});


socket.on('roomMsg', function (message) {
    console.log('Room Message :'+message)
});