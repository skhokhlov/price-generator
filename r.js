'use strict';

const fs = require('fs-extra');

var readableStream = fs.createReadStream(__dirname + '/files/Untitled.csv');
var data = '';

readableStream.on('data', (chunk) => {
    data += chunk;
});

readableStream.on('end', () => {
    data = data.replace(new RegExp(';;;', 'g'), '');
    data = data.split('\r\n');

    var parse = [];
    for (let i in data) {
        if (data[i] !== '') {
            parse.push(data[i].split(new RegExp(';', 'g'), 3));
        }
    }
    console.log(parse);
});