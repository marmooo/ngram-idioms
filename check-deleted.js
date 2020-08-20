const fs = require('fs');
const readline = require('readline');
const readEachLineSync = require('read-each-line-sync')

let args;
if (process.argv.length != 4) {
  console.log('USAGE: uniq.js [file (all)] [file (idioms)]');
  process.exit(1);
} else {
  args = process.argv.slice(2);
}

let idioms = {};
readEachLineSync(args[0], 'utf8', (idiom) => {
  idioms[idiom] = true;
});
readEachLineSync(args[1], 'utf8', (idiom) => {
  if (idioms[idiom]) {
    delete idioms[idiom];
  }
});
for (var idiom of Object.keys(idioms)) {
  process.stdout.write(idiom + ',');
}
