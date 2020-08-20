const fs = require('fs');
const readline = require('readline');

const threshold = 10000;
const idiomLength = 3;

const sexualList = fs.readFileSync('Sexual.txt', 'utf-8').split('\n');
(async() => {
  var idioms = {};
  const stream = fs.createReadStream('nwc2010-ngrams/char/over999/5gms/5gm.lst');
  const reader = readline.createInterface({ input: stream });
  for await (const line of reader) {
    var arr = line.split(/\s/);  // <S>, </S> に注意が必要
    var included = true;
    if (!/[0-9ァ-ヶ]/.test(arr[0])) {
      for (var i=1; i<=idiomLength; i++) {
        if (!/[ァ-ヶ]/.test(arr[i])) {
          included = false;
        }
      }
      if (included && /[0-9ァ-ヶ]/.test(arr[idiomLength+1])) {
        included = false;
      }
      if (included) {
        var idiom = arr.slice(1, idiomLength + 1).join('');
        var count = parseInt(arr[arr.length-1]);
        if (idioms[idiom]) {
          idioms[idiom] += count;
        } else {
          idioms[idiom] = count;
        }
      }
    }
  }
  for (var i=0; i<sexualList.length; i++) {
    delete idioms[sexualList[i]];
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

