const fs = require('fs');
const readline = require('readline');
const readEachLineSync = require('read-each-line-sync')

let args;
if (process.argv.length != 3) {
  console.log('USAGE: list2arr.js [file]');
  process.exit(1);
} else {
  args = process.argv.slice(2);
}

let idioms = {};
readEachLineSync(args[0], 'utf8', (line) => {
  var idiom = line.slice(0, line.length);
  if (idioms[idiom]) {
    idioms[idiom] += 1;
  } else {
    idioms[idiom] = 1;
  }
});
for (var idiom of Object.keys(idioms)) {
  if (idioms[idiom] > 1) {
    delete idioms[idiom];
  }
}
for (var idiom of Object.keys(idioms)) {
  process.stdout.write(idiom + ',');
}
