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
  stream.write(`const i${i}_ = '${idioms.slice(0, -1)}'.split(',');\n`);
}
for (var i=1; i<=9; i++) {
  var idioms = fs.readFileSync('kanji-2-10000/' + i + '.arr');
  idioms = idioms.toString().split(',').slice(0, -1);
  var ignored = getIgnored('kanji-2-all/' + i + '.arr', idioms);
  stream.write(`const g${i}_ = '${ignored}'.split(',');\n`);
}
stream.end();

stream = fs.createWriteStream('dist/game3.js');
for (var i=1; i<=9; i++) {
  var idioms = fs.readFileSync('kanji-3-5000/' + i + '.arr');
  stream.write(`const i${i}_ = '${idioms.slice(0, -1)}'.split(',');\n`);
}
stream.end();

stream = fs.createWriteStream('dist/gameA.js');
for (var i=1; i<=9; i++) {
  var idioms2 = fs.readFileSync('kanji-2-10000/' + i + '.arr');
  var idioms3 = fs.readFileSync('kanji-3-5000/' + i + '.arr');
  var idioms = idioms2 + idioms3;
  stream.write(`const i${i}_ = '${idioms.slice(0, -1)}'.split(',');\n`);
}
for (var i=1; i<=9; i++) {
  var idioms = fs.readFileSync('kanji-2-10000/' + i + '.arr')
  idioms = idioms.toString().split(',').slice(0, -1);
  var ignored = getIgnored('kanji-2-all/' + i + '.arr', idioms);
  stream.write(`const g${i}_ = '${ignored}'.split(',');\n`);
}
stream.end();

