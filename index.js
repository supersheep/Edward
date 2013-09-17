var http = require("http");
var fs = require("fs");
var url = require("url");
var path = require("path");
var child_process = require("child_process");
var MD5 = require("MD5");

var script = "main.js";

function sendfile(req,res,file){
    var content = fs.readFileSync(file);
    res.end(content);
}

var server = http.createServer(function(req, res){
    var parsed = url.parse(req.url,true);

    var args = [script];

    // page url
    var query = parsed.query;

    if(!query.url){
        res.writeHead(404);
        res.end("not found");
        return;
    }
    query.pic = "./img/" + MD5(query.url) + ".png";

    for(var key in query){
        args.push("--" + key + "=" + query[key]);
    }

    var caper_process = child_process.spawn("casperjs", args);

    caper_process.stdout.on("data",function(data){
        console.log(data.toString());
        var splited = data.toString().trim().split(":");
        var type = splited[0];
        var arg = splited[1];

        if(type == "save"){
            try{
                fs.readFileSync(path.resolve(arg));
            }catch(e){
                console.log("oh no!");
            }

            console.log(arg);
            console.log(query.pic);
            console.log(arg==query.pic);
            sendfile(req,res,path.resolve(arg));
            
        }
    });

    caper_process.on("exit",function(){
        // res.end();
    });

});

server.listen(3900);