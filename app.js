var express = require("express");
var url = require("url");
var path = require("path");
var fs = require("fs");
var uglify = require("uglify-js");
var MIME = require("./mime");
var config = require("./config");
//var template = require("art-template/node/template-native.js");
var md5 = require("md5");
var port = process.env.PORT || 8000;
var app = express();

//template.config("base", "");
//template.config("extname", "html");

//app.engine(".html", template.__express);
//app.set("view engine", "html");
//app.set("views", "./views");

// 默认通路测试接口
app.get("/", function (req, res) {
    console.log("run get /");
    res.send("Hello world!");
});

// 请求合并接口
app.get("/combine/*", function (req, res) {
    console.time("combine");
    console.log("run get /combine. request path: ", req.params["0"]);
    
    var url = req.params["0"],
        result = "";
    if (!url) {
        res.set("Content-Type", MIME.types["js"]);
        res.send(result);
        return false;
    }
    
    config.cache_path = path.resolve(config.base, config.cache_path);
    console.log("config.cache_path: " + config.cache_path);
    
    if (!config.cache) {
        concatFile(url, res);
        return false;
    }
    cacheCheck(url, function (result) {
        if (!result) {
            concatFile(url, res);
            return false;
        }
        console.log("cache done.");

        res.set("Content-Type", MIME.types["js"]);
        res.send(result);

        console.timeEnd("combine");
    });
});

// 调用循环合并请求功能
function concatFile(url, res) {
    loopFiles(url, {
        done: function (data) {
            console.log("done.");
            
            res.set("Content-Type", MIME.types["js"]);
            res.send(data);
            if (config.cache) {
                cacheWrite(url, data);
            }
            
            console.timeEnd("combine");
        }
    });
}

// 创建缓存目录
function mkdir(dirpath, mode) {
    var pathTemp;
    mode = mode || "0777"
    if (fs.existsSync(dirpath)) {
        console.log(dirpath + " exists.");
        return true;
    }
    if (mkdir(path.dirname(dirpath), mode)) {
        fs.mkdirSync(dirpath, mode);
        console.log(dirpath + " mkdir.");
        return true;
    }
}

// 检查缓存文件是否存在
function cacheCheck(url, callback) {
    var filePath = path.resolve(config.cache_path, md5(url) + ".json"), data;
    fs.exists(filePath, function (exists) {
        if (!exists) {
            return callback(false);
        }
        fs.readFile(filePath, "utf-8", function (err, buffer) {
            if (err) {
                console.log("read cache err.");
                return callback(false);
            }
            data = buffer.toString();
            if (!data) {
                return callback(false);
            }
            data = JSON.parse(data);
            if (new Date().getTime() > data.updateTime + config.cache_expiration_time) {
                fs.unlinkSync(filePath);
                return callback(false);
            }
            return callback(data.data);
        });
    });
}

// 写入缓存文件
function cacheWrite(url, data) {
    mkdir(config.cache_path);
    fs.writeFile(path.resolve(config.cache_path, md5(url) + ".json"), JSON.stringify({
        url: url,
        data: data,
        updateTime: new Date().getTime()
    }));
}

// 循环调用读取请求文件
function loopFiles(url, emit) {
    var urls, indexs, i, len, filename;
    urls = url.split(",");
    emit.len = urls.length;
    emit.indexs = new Array(urls.length);
    for (i = 0; i < urls.length; i++) {
        filename = urls[i];
        readFile(filename, i, emit);
    }
}

// 读取请求文件，合并文件内容
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
    (function (filePath, i) {
        fs.exists(filePath, function (exists) {
            if (exists) {
                console.log(emit.len);
                if (!--emit.len) {
                    emit.done(emit.indexs.join(""));
                }
                return false;
            }
            fs.readFile(filePath, "utf-8", function (err, buffer) {
                console.log("file: " + filePath);
                if (err) {
                    console.log("error: " + filePath + "404 (Not Found)");
                } else {
                    console.time("min");
                    if (config.compress) {
                        emit.indexs[i] = min(buffer.toString());
                    } else {
                        emit.indexs[i] = buffer.toString();
                    }
                    console.timeEnd("min");
                }
                console.log(i);
                if (!--emit.len) {
                    emit.done(emit.indexs.join(""));
                }
            });
        });
    })(filePath, i);
    
    console.timeEnd("readFile");
}

// 压缩文件内容
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

