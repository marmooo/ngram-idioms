const fs = require('fs');
const readline = require('readline');
const readEachLineSync = require('read-each-line-sync')

let args;
if (process.argv.length != 3) {
  console.log('USAGE: minify.js [n]');
  process.exit(1);
} else {
  args = process.argv.slice(2);
}

let idioms = {};
for (var i=1; i<=parseInt(args[0]); i++) {
  readEachLineSync('dist/' + i + '.lst', 'utf8', (idiom) => {
    if (idioms[idiom]) {
      idioms[idiom] += 1;
    } else {
      idioms[idiom] = 1;
    }
  });
}
for (var idiom of Object.keys(idioms)) {
  if (idioms[idiom] > 1) {
    delete idioms[idiom];
  }
}
for (var idiom of Object.keys(idioms)) {
  process.stdout.write(idiom + ',');
}
