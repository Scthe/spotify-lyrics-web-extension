// tiny script to pack the extension into .zip
// the result is 'spotify-lyrics-popup.zip' in root dir of this app

var fs = require('fs');
var path = require('path');
var archiver = require('archiver');

var IN_DIR = 'extension/';
var OUT_FILE = 'spotify-lyrics-popup.zip';

var outPath = path.join(__dirname, OUT_FILE);
var output = fs.createWriteStream(outPath);
var archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});

output.on('close', function() {
  console.log(archive.pointer() + ' total bytes');
  console.log('The file \'' + OUT_FILE + '\' was succesfully created. Ready to upload to the extension store!');
});

output.on('end', function() {
  console.log('Data has been drained');
});

archive.on('warning', function(err) {
  if (err.code === 'ENOENT') {
    // ?
  } else {
    throw err;
  }
});

archive.on('error', function(err) {
  throw err;
});

// pipe archive data to the file
archive.pipe(output);

archive.directory(IN_DIR, false);

archive.finalize();