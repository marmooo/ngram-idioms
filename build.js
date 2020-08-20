const execSync = require('child_process').execSync;

for (var i=1; i<=9; i++) {
  execSync(`node kanji-words.js ${i} > dist/${i}.lst`);
  execSync(`node minify.js ${i} > dist/${i}.arr`);
}
