const fs = require('fs');
const readline = require('readline');

const threshold = 10000;
const mergeNum = 1;  // 形態素の結合数 (2以上はノイズあり)
const idiomLength = 6;

const sexualList = fs.readFileSync('Sexual.txt', 'utf-8').split('\n');
const ignoreList = fs.readFileSync('ignore-kana.lst', 'utf-8').split('\n');
(async() => {
  var idioms = {};
  const stream = fs.createReadStream('nwc2010-ngrams/word/over999/5gms/5gm.lst');
  const reader = readline.createInterface({ input: stream });
  for await (const line of reader) {
    var included = true;
    var morphemes = line.split(/\s/);
    var count = parseInt(morphemes[morphemes.length-1]);
    if (!/[0-9ァ-ヶー]/.test(morphemes[0])) {
      for (var m=2; m<mergeNum+2; m++) {
        var idiom = morphemes.slice(1, m).join('');
        if (idiom.length == idiomLength && !/[0-9ァ-ヶー]/.test(morphemes[m])) {
          var chars = idiom.split('');
          for (var i=0; i<chars.length; i++) {
            if (!/[ァ-ヶー]/.test(chars[i])) {
              included = false;
            }
          }
          if (included) {
            if (idioms[idiom]) {
              idioms[idiom] += count;
            } else {
              idioms[idiom] = count;
            }
          }
        }
      }
    }
  }
  for (var i=0; i<sexualList.length; i++) {
    delete idioms[sexualList[i]];
  }
  for (var i=0; i<ignoreList.length; i++) {
    delete idioms[ignoreList[i]];
  }
  for (var idiom of Object.keys(idioms)) {
    if (idioms[idiom] < threshold) {
      delete idioms[idiom];
    }
  }
  var arr = Object.keys(idioms).map((e)=>({ key: e, value: idioms[e] }));
  arr.sort(function(a,b){
    if(a.value < b.value) return 1;
    if(a.value > b.value) return -1;
    return 0;
  });
  for (var i=0; i<arr.length; i++) {
    console.log(arr[i].key);
  }
})();

