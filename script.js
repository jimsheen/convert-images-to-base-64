var fs = require('fs-extra')

var base64Img = require('base64-img');

var prependFile = require('prepend-file');

var target = '_icons.scss';
var string = '';
var count = 0;
var walk = function(dir, done) {

    console.log(dir);

    var results = [];
    var filename = '';

    fs.truncate(target, 0);
    fs.readdir(dir, function(err, list) {
        if (err) return done(err);
        var i = 0;
        (function next() {
            var file = list[i++];
            if (!file) return done(null, results);
            file = dir + '/' + file;
            fs.stat(file, function(err, stat) {
                if (stat && stat.isDirectory()) {
                    // walk(file, function(err, res) {
                    //     results = results.concat(res);
                        next();
                    // });
                } else {
                    if (file.indexOf('.png') != -1) {
                        base64Img.base64(file, function(err, data) {

                            if (err) throw err;

                            if (data) {
                                filename = file.replace(/^.*[\\\/]/, '');

                                filename = filename.slice(0, -4);
                                console.log(file);
                                string = '%' + filename + ' { background:url(' + data + '); } \n' ;
                                count++;
                                prependFile.sync(target, string)
                            }

                        })
                    }
                    next();
                }
            });
        })();
    });

};

walk(__dirname, function(err, results) {
    console.log(count + ' icons converted');
    if (err) throw err;
});
