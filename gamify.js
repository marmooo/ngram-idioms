const fs = require('fs');
const readline = require('readline');

function getIgnored(filepath, idioms) {
  var all = {};
  var arr = fs.readFileSync(filepath).toString().split(',').slice(0, -1);
  arr.forEach(idiom => {
    all[idiom] = true;
  });
  idioms.forEach(idiom => {
    delete all[idiom];
  });
  return Object.keys(all);
}


var stream = fs.createWriteStream('dist/game2.js');
for (var i=1; i<=9; i++) {
  var idioms = fs.readFileSync('kanji-2-10000/' + i + '.arr');
  stream.write(`let i${i} = Array.from('${idioms.slice(0, -1)}');\n`);
}
for (var i=1; i<=9; i++) {
  var idioms = fs.readFileSync('kanji-2-10000/' + i + '.arr');
  idioms = idioms.toString().split(',').slice(0, -1);
  var ignored = getIgnored('kanji-2-all/' + i + '.arr', idioms);
  stream.write(`let g${i} = Array.from('${ignored}');\n`);
}
stream.end();

stream = fs.createWriteStream('dist/game3.js');
for (var i=1; i<=9; i++) {
  var idioms = fs.readFileSync('kanji-3-5000/' + i + '.arr');
  stream.write(`let i${i} = Array.from('${idioms.slice(0, -1)}');\n`);
}
stream.end();

stream = fs.createWriteStream('dist/gameA.js');
for (var i=1; i<=9; i++) {
  var idioms2 = fs.readFileSync('kanji-2-10000/' + i + '.arr');
  var idioms3 = fs.readFileSync('kanji-3-5000/' + i + '.arr');
  var idioms = idioms2 + idioms3;
  stream.write(`let i${i} = Array.from('${idioms.slice(0, -1)}');\n`);
}
for (var i=1; i<=9; i++) {
  var idioms = fs.readFileSync('kanji-2-10000/' + i + '.arr')
  idioms = idioms.toString().split(',').slice(0, -1);
  var ignored = getIgnored('kanji-2-all/' + i + '.arr', idioms);
  stream.write(`let g${i} = Array.from('${ignored}');\n`);
}
stream.end();

