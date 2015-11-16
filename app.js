var express = require("express");
var template = require("art-template/node/template-native.js");
var port = process.env.PORT || 8000;
var app = express();

template.config("base", "");
template.config("extname", "html");

app.engine(".html", template.__express);
app.set("view engine", "html");
//app.set("views", "./views");

app.get("/", function (req, res) {
    res.send("Hello world!");
});

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});
