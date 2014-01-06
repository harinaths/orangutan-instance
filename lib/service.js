/**
 * Created with JetBrains WebStorm.
 * User: harinaths
 * Date: 4/1/14
 * Time: 7:24 PM
 * To change this template use File | Settings | File Templates.
 */

var util = require('./util');
var io = require('socket.io-client');
var _ = require('underscore');
var serialport = require("serialport");
var SerialPort =  serialport.SerialPort
var Service = function(config){
    this.config = config;
    return this;
}
var portsObject = {};


Service.prototype.initialize = function(){
    if(this.config.url) {

        var self = this;
        this.socket = io.connect(this.config.url);
        this.socket.on('connect', function(){

            console.log("Socket Connected...");
            util.systemMacAddress(function(err, mac){
                if(!err && mac){
                    self.mac = mac;
                    self.socket.emit('register',mac);
                    self.socket.emit('join',mac);
                    self.registerSerivices();
                }else{
                    console.log(" Service disconnected please check ");
                    self.socket.disconnect(true);

                }
            });

        } );

        this.socket.on('disconnect', function(){
            console.log("Disconnected .. ")
            portsObject = {};
        } );

    };

};

Service.prototype.registerSerivices = function(){
    var self = this;
    this.socket.on('ping', function(){
        self.socket.emit('broadcast',{room:self.mac, handler : 'pingResponse', msg : {mac : self.mac, response : 'PING_OK'}});
    });
    this.socket.on('portsList', function(){
        console.log('PORT LIST..... ')
        serialport.list(function (err, ports) {

            if(!err){
                console.log("Ports List : ", _.pluck(ports,'comName') );
                self.socket.emit('broadcast',{room:self.mac, handler : 'portsListResponse', msg : {mac : self.mac, ports : _.pluck(ports,'comName')}});
            }

        });

    });
    this.socket.on('connectPort', function(req){

        //********************************************************************
        console.log(req);

        var sp = new SerialPort(req.port, req.options);
        portsObject[req.port] = sp;

        sp.on('open', function(){

            sp.on('data',function(data){

                console.log('HEX FORMAT : ', data.toString('hex'));
                console.log("ASCII FORMAT : ", data.toString('ascii'));
                console.log('---------------------------------------------------------------------------------------------');
                self.socket.emit('broadcast',{room:self.mac+':'+req.port, handler : 'portMessage', msg : {mac : self.mac, port : req.port,ascii : data.toString('ascii'), hex : data.toString('hex') }});
                //self.emit('portMessage', {ascii : data.toString('ascii'), hex : data.toString('hex')  }) ;

            });
//        sp.write("at+ionip?\r\n", function(err, results) {
//            console.log('err ' + err);
//            console.log('results ' + results);
//        });
        });

        sp.on('error', function(){
            console.log('Error');
            req.io.emit('error', {port : req.data.port}) ;
        });

        sp.on('close', function(){
            req.io.emit('close', {port : req.data.port}) ;
            console.log('Closed');
        });
        //********************************************************************

        //console.log(port);
    })

    this.socket.on('command', function(req){
        var sp = portsObject[req.port];
        console.log(req);
        if(sp ){
            sp.write(req.command+'\r\n', function(err, results) {
                console.log('err ' + err);
                console.log('results ' + results);
            });
        }

    });

}

module.exports =  Service;