'use strict';

const express = require('express');
const fs = require('fs-extra');
const busboy = require('connect-busboy');

const app = express();
app.use(busboy());

const priceSVG = fs.readFileSync('price.svg', {encoding: 'utf-8'});
const priceHTML = fs.readFileSync('price.html', {encoding: 'utf-8'});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

//app.get('/upload', (req, res) => res.redirect('/'));

app.post('/upload', (req, res) => {
    var fstream;
    req.pipe(req.busboy);

    req.busboy.on('file', (fieldname, file, filename) => {
        fstream = fs.createWriteStream(__dirname + '/files/' + filename);
        file.pipe(fstream);
        fstream.on('close', () => {
            var readableStream = fs.createReadStream(__dirname + '/files/' + filename);
            var data = '';

            readableStream.on('data', (chunk) => {
                data += chunk;
            });

            readableStream.on('end', () => {
                data = data.replace(new RegExp(';;;', 'g'), '');
                data = data.split('\r\n');

                var result = '';

                for (let i in data) {
                    if (data[i] !== '') {
                        let parse = data[i].split(new RegExp(';', 'g'), 3);
                        result += priceSVG.replace('{ name }', parse[1])
                            .replace('{ price }', parse[2])
                            .replace('{ id }', parse[0]);
                    }
                }
                res.send(priceHTML.replace('{ content }', result));
                fs.remove(__dirname + '/files/' + filename);
            });
        });
    });
});

app.listen(process.env.PORT || 3000);
