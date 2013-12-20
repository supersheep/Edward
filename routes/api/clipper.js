var db = require("../../db");
var MD5 = require("MD5");
var exec = require("child_process").exec;
var config = require("../../config");

module.exports = function(req,res){
	var args = [];

	for(var k in req.query){
		args.push("--" + k + "=" + req.query[k]);
	}

	var pic = MD5(args.join("")) + ".png"

	var command = ["casperjs","main.js"].concat(args).concat(["--pic=" + config.pathPrefix + pic]).join(" ");

	exec(command,function(err,stdout,stderr){
		if(err){
			return res.send(500,stdout.match(/:?\[\[ (.*) \]\]/)[1]);
		}else{
			return res.send(200,config.urlPrefix + pic);
		}
	});
	// exec();
	// res.send(200,"ok");
};