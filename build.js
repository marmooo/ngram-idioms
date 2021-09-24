const execSync = require('child_process').execSync;

for (var i=1; i<=10; i++) {
  execSync(`node kanji-words.js ${i} > dist/${i}.lst`);
}
