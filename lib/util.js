/**
 * Created with JetBrains WebStorm.
 * User: harinaths
 * Date: 4/1/14
 * Time: 7:13 PM
 * To change this template use File | Settings | File Templates.
 */


var address = require('address');

var systemMacAddress = function(cb){
    cb && address.mac(cb);
};



module.exports = {
    systemMacAddress : systemMacAddress
}