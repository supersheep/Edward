var casper = require('casper').create();

var utils = require('utils');

var page_url = casper.cli.options.url
    , pic_name = casper.cli.options.pic || +new Date()
    , width = casper.cli.options.width || 320
    , height = casper.cli.options.height || 1200;

casper.start(page_url);

casper.userAgent('Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_2 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8H7 Safari/6533.18.5');

casper.viewport(width,height);

casper.then(function(){
    this.capture(pic_name, {
        top: 0,
        left: 0,
        width: width,
        height: height
    });
});

casper.then(function(){
    this.echo("save:" + pic_name);
});

casper.run(function(){
    casper.exit();
});