const fs = require('fs');

function smallToBig(str) {
  var pos = 'ァィゥェォヵヶッャュョヮ'.indexOf(str);
  if (pos == -1) {
    return str;
  } else {
    return 'アイウエオカケツヤユヨワ'[pos];
  }
}


var siritori = {}
for (var i=3; i<=6; i++) {
  var filepath = 'kana-10000/' + i + '.lst';
  var lines = fs.readFileSync(filepath).toString().split('\n').slice(0, -1);
  lines.forEach(line => {
    var aiueo0 = smallToBig(line[0]);
    var aiueo1 = smallToBig(line[line.length-1]);
    if (aiueo1 != 'ン' || aiueo1 != 'ー') {
      if (siritori[aiueo0]) {
        siritori[aiueo0].push(line);
      } else {
        siritori[aiueo0] = [line];
      }
    }
  });
}
process.stdout.write(JSON.stringify(siritori));

