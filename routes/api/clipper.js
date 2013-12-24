var db = require("../../db");
var MD5 = require("MD5");
var exec = require("child_process").exec;
var config = require("../../config");
var fs = require("fs");
var path = require("path");
var EventEmitter =  require("events").EventEmitter;
var proxy = new EventEmitter();
var LRU = require("lru-cache")
  , options = { max: 500
              , length: function (n) { return n * 2 }
              , maxAge: 1000 * 60 * 60 }
  , cache = LRU(options)
  , otherCache = LRU(50) // sets just the max size

proxy.setMaxListeners(0);

function getPicByQuery(query,callback){
	var args = [];
	for(var k in query){
		var value = null;
		try{
			value = JSON.parse(query[k]);
		}catch(e){
			value = query[k];
		}

		if(typeof value == "boolean" && value){
			args.push("--" + k);
		}else{
			args.push("--" + k + "=" + value);
		}
	}

	var pic = MD5(args.join("")) + ".png";
	var imagePath = path.resolve(config.pathPrefix, pic);
	var command = ["casperjs","main.js"].concat(args).concat(["--pic=" + imagePath]).join(" ");
	fs.exists(imagePath,function(exists){
		if(exists){
			callback(null,config.urlPrefix + pic);
		}else{
			clip(command,pic,callback);
		}
	});
}

var commands = {};
function clip(command,pic,callback){
	var timeout = null;
	var eventName = "clipped:" + command;
	timeout = setTimeout(function(){
		callback("timeout");
	},config.timeout);

		proxy.once(eventName,function(err,data){
			clearTimeout(timeout);
			console.log("proxy: %s %s", err, data)
			callback(err,data);
			delete commands[command];
		});

		if(commands[command]){
			return;
		}
		commands[command] = true;
		console.log("exec: %s", command);
		exec(command,function(err,stdout,stderr){
			var errMsg = null;
			var data = null;
			console.log("exec: done",err,stdout,stderr);
			if(err){
				try{
					errMsg = stdout.match(/:?\[\[ (.*) \]\]/)[1];
				}catch(e){
					errMsg = err;
				}
			}else{
				errMsg = null;
				data = config.urlPrefix + pic;
			}
			console.log("exec: err: %s, stdout: %s, stderr %s",err,stdout,stderr);
			proxy.emit(eventName,errMsg,data);
		});

}


module.exports = function(req,res){
	var query = req.query;

	var serialized = JSON.stringify(query);

	var value = cache.get(serialized);
	// if(value){
	// 	res.send(200,value);
	// }else{
		getPicByQuery(query,function(err,value){
			console.log("getpic: %s %s",err,value);
			if(err){
				return res.send(500,err);
			}else{
				// cache.set(serialized,value);
				res.send(200,value);
			}
		});
	// }
};