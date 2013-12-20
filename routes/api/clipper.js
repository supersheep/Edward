var db = require("../../db");
var MD5 = require("MD5");
var exec = require("child_process").exec;
var config = require("../../config");
var fs = require("fs");
var path = require("path");

module.exports = function(req,res){
	var args = [];

	for(var k in req.query){
		args.push("--" + k + "=" + req.query[k]);
	}

	var pic = MD5(args.join("")) + ".png";

	var imagePath = path.resolve(config.pathPrefix, pic);
	var command = ["casperjs","main.js"].concat(args).concat(["--pic=" + imagePath]).join(" ");


	fs.exists(imagePath,function(exists){
		if(exists){
			return res.send(200,config.urlPrefix + pic);
		}else{
			clip();
		}
	});

	function clip(){
		exec(command,function(err,stdout,stderr){
			if(err){
				return res.send(500,stdout.match(/:?\[\[ (.*) \]\]/)[1]);
			}else{
				return res.send(200,config.urlPrefix + pic);
			}
		});
	}
};