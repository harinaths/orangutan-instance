/**
 * Created with JetBrains WebStorm.
 * User: harinaths
 * Date: 4/1/14
 * Time: 7:12 PM
 * To change this template use File | Settings | File Templates.
 */


var config = global.config =  require('./config');
var Service = require('./lib/service');
var service = new Service(config);

service.initialize();