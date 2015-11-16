var express = require("express");
var url = require("url");
var path = require("path");
var fs = require("fs");
var uglify = require("uglify-js");
var MIME = require("./mime");
var config = require("./config");
var template = require("art-template/node/template-native.js");
var port = process.env.PORT || 8000;
var app = express();

template.config("base", "");
template.config("extname", "html");

app.engine(".html", template.__express);
app.set("view engine", "html");
//app.set("views", "./views");

app.get("/", function (req, res) {
    console.log("run get /");
    res.send("Hello world!");
});

app.get("/combo", function (req, res) {
    console.log("run combo.");
    console.log(req.url);
    var url = req.url.substr(1),
        startIndex = url.indexOf("??"),
        pathname, urls, result = "", ext;
    if (startIndex === -1) {
        url = path.resolve(config.base, url);
        ext = path.extname(url);
        if (!ext) {
            ext = "text";
        }
        if (fs.existsSync(url)) {
            result = fs.readFileSync(url).toString() || "404";
        }
//        res.writeHead(200, {
//            "Content-Type": MIME[ext]
//        });
//        res.end(result);
        
        res.set("Content-Type", MIME.types["js"]);
        res.send(result);
        return false;
    }
    pathname = url.substring(startIndex + 2);
    urls = pathname.split(",");
    urls.forEach(function (filename) {
        var filePath;
        if (!filename) {
            return false;
        }
        filePath = path.resolve(config.base, filename);
        ext = path.extname(filePath);
        if (!ext) {
            filePath += ".js";
        }
        if (fs.existsSync(filePath)) {
            result += min(fs.readFileSync(filePath).toString());
        }
    });
    
//    res.writeHead(200, {
//        "Content-Type": MIME.types["js"]
//    });
//    res.end(result);
    res.set("Content-Type", MIME.types["js"]);
    res.send(result);
});

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});


function min(fileContent) {
    return uglify.minify(fileContent, {
        fromString: true,
        compress: {
            hoist_vars: true
        }
    }).code;
}