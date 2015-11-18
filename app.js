var express = require("express");
var url = require("url");
var path = require("path");
var fs = require("fs");
var uglify = require("uglify-js");
var MIME = require("./mime");
var config = require("./config");
//var template = require("art-template/node/template-native.js");
var md5 = require("MD5");
var port = process.env.PORT || 8000;
var app = express();

//template.config("base", "");
//template.config("extname", "html");

//app.engine(".html", template.__express);
//app.set("view engine", "html");
//app.set("views", "./views");

app.get("/", function (req, res) {
    console.log("run get /");
    res.send("Hello world!");
});

app.get("/combine/*", function (req, res) {
    console.log("run get /combine. request path: ", req.params["0"]);
    
    var url = req.params["0"],
        result = "";
    if (!url) {
        res.set("Content-Type", MIME.types["js"]);
        res.send(result);
        return false;
    }
    
    config.cache_path = path.resolve(config.base, config.cache_path);
    
    if (config.cache) {
        result = cacheCheck(url);
        if (result) {
            console.log("cache done.");
            res.set("Content-Type", MIME.types["js"]);
            res.send(result);
            return false;
        }
    }
    
    loopFiles(url, {
        done: function (data) {
            console.log("done.");
            res.set("Content-Type", MIME.types["js"]);
            res.send(data);
            cacheWrite(url, data);
        }
    });
    
});

function mkdir(dirpath, mode) {
    var pathTemp;
    mode = mode || "0777"
    if (fs.existsSync(dirpath)) {
        return false;
    }
    dirpath.split(path.sep).forEach(function (dirname) {
        if (pathTemp) {
            pathTemp = path.join(pathTemp, dirname);
        } else {
            pathTemp = dirname;
        }
        if (!fs.existsSync(pathTemp)) {
            if (!fs.mkdirSync(pathTemp)) {
                chmod(pathTemp, mode);
                return false;
            }
        }
    });
    return true;
}

function chmod(dirpath, mode) {
    return fs.chmodSync(dirpath, mode);
}

function cacheCheck(url) {
    var filePath = path.resolve(config.cache_path, md5(url) + ".json"),
        isFile = fs.existsSync(filePath),
        data;
    if (!isFile) {
        return false;
    }
    data = fs.readFileSync(filePath).toString();
    if (!data) {
        return false;
    }
    data = JSON.parse(data);
    if (new Date().getTime() > data.updateTime + config.cache_expiration_time) {
        fs.unlinkSync(filePath);
        return false;
    }
    return data.data;
}

function cacheWrite(url, data) {
    mkdir(config.cache_path);
    fs.writeFileSync(path.resolve(config.cache_path, md5(url) + ".json"), JSON.stringify({
        url: url,
        data: data,
        updateTime: new Date().getTime()
    }));
}

function loopFiles(url, emit) {
    var urls, indexs, i, len, filename;
    urls = url.split(",");
    emit.len = urls.length;
    emit.indexs = new Array(urls.length);
    for (i = 0; i < urls.length; i++) {
        filename = urls[i];
        readFile(filename, i, emit);
//        readFileSync(filename, i, emit);
    }
}

function readFileSync(filename, i, emit) {
    var filePath,
        ext = "", logTime;
    
    console.time("readFile");
    
    if (!filename) {
        return false;
    }
    filePath = path.resolve(config.base, filename);
    ext = path.extname(filePath);
    if (!ext) {
        filePath += ".js";
    }
    if (fs.existsSync(filePath)) {
        emit.indexs[i] = min(fs.readFileSync(filePath).toString());
    }
    
    if (!--emit.len) {
        emit.done(emit.indexs.join(""));
    }
    
    console.timeEnd("readFile");
}

function readFile(filename, i, emit) {
    var filePath,
        ext = "";
    
    console.time("readFile");
    
    if (!filename) {
        return false;
    }
    filePath = path.resolve(config.base, filename);
    ext = path.extname(filePath);
    if (!ext) {
        filePath += ".js";
    }
    if (fs.existsSync(filePath)) {
        (function (filePath, i) {
            fs.readFile(filePath, "utf-8", function (err, buffer) {
                console.log("file: " + filePath);
                if (err) {
                    console.log("error: " + filePath + "404 (Not Found)");
                } else {
                    console.time("min");
                    emit.indexs[i] = min(buffer.toString());
                    console.timeEnd("min");
                }
                console.log(emit.len);
                if (!--emit.len) {
                    emit.done(emit.indexs.join(""));
                }
            });
        })(filePath, i);
    } else {
        console.log(emit.len);
        if (!--emit.len) {
            emit.done(emit.indexs.join(""));
        }
    }
    
    console.timeEnd("readFile");
}

function min(fileContent) {
    return uglify.minify(fileContent, {
        fromString: true,
        compress: {
            hoist_vars: true
        }
    }).code;
}

var server = app.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});

