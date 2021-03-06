var casper = require('casper').create({
    onLoadError:function(){
        casper.die("loadError.", 1);
    }
});


var url = casper.cli.options.url
    , pic = casper.cli.options.pic || null
    , viewport = casper.cli.options.viewport
    , offset = casper.cli.options.offset
    , size = casper.cli.options.size
    , desktop = casper.cli.options.desktop
    , selector = casper.cli.options.selector;

function paramToArray(param){
    return param.split(",").map(function(s){return parseInt(s,10);});
}


if(!url){
    throw new Error("[[ --url should be expected ]]");
}

if(!pic){
    throw new Error("[[ --pic should be expected ]]");
}

var UA_PRESETS = {
    "mobile":"Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5",
    "desktop":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.63 Safari/537.36"
}


casper.start();

var ua = UA_PRESETS[desktop?"desktop":"mobile"];
casper.userAgent(ua);

casper.open(url,{
    headers:{
        "X-Requested-With":"Edward"
    }
});

if(viewport){
    viewport = paramToArray(viewport);
    casper.viewport(viewport[0],viewport[1]);
}

casper.then(function(){
    var clipRect = null;
    if(selector){
        console.log("capture with selector");
        this.captureSelector(pic,selector);
    }else if(offset && size){
        offset = paramToArray(offset);
        size = paramToArray(size);
        clipRect = {
            top: offset[0],
            left: offset[1],
            width: size[0],
            height: size[1]
        };
        console.log("capture with rect:",pic,clipRect);
        this.capture(pic,clipRect);
    }else{
        console.log("capture:",pic);
        this.capture(pic);
    }
});

casper.run(function(){
    casper.exit();
});