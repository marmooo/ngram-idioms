import { readLines } from "https://deno.land/std/io/mod.ts";

if (Deno.args.length < 1) {
  console.log("USAGE: kana-words.js [threshold]");
  Deno.exit(1);
}
const threshold = parseInt(Deno.args[0]);

const mergeNum = 1; // 形態素の結合数 (2以上はノイズあり)
const nameList = Deno.readTextFileSync("ignore-family-name.lst").split("\n");
const sexualList = Deno.readTextFileSync("inappropriate-words-ja/Sexual.txt")
  .split("\n");
const ignoreList = Deno.readTextFileSync("ignore-kana.lst").split("\n");

async function _listupFromChars(idiomLength) {
  const idioms = {};
  const fileReader = await Deno.open(
    "nwc2010-ngrams/char/over999/5gms/5gm.lst",
  );
  for await (const line of readLines(fileReader)) {
    const arr = line.split(/\s/); // <S>, </S> に注意が必要
    let included = true;
    if (!/[0-9ァ-ヶ]/.test(arr[0])) {
      for (let i = 1; i <= idiomLength; i++) {
        if (!/[ァ-ヶ]/.test(arr[i])) {
          included = false;
        }
      }
      if (included && /[0-9ァ-ヶ]/.test(arr[idiomLength + 1])) {
        included = false;
      }
      if (included) {
        const idiom = arr.slice(1, idiomLength + 1).join("");
        const count = parseInt(arr[arr.length - 1]);
        if (idioms[idiom]) {
          idioms[idiom] += count;
        } else {
          idioms[idiom] = count;
        }
      }
    }
  }
  return idioms;
}

async function listupFromWords(idiomLength) {
  const idioms = {};
  const fileReader = await Deno.open(
    "nwc2010-ngrams/word/over999/5gms/5gm.lst",
  );
  for await (const line of readLines(fileReader)) {
    let included = true;
    const morphemes = line.split(/\s/);
    const count = parseInt(morphemes[morphemes.length - 1]);
    if (!/[0-9ァ-ヶー]/.test(morphemes[0])) {
      for (let m = 2; m < mergeNum + 2; m++) {
        const idiom = morphemes.slice(1, m).join("");
        if (idiom.length == idiomLength && !/[0-9ァ-ヶー]/.test(morphemes[m])) {
          const chars = idiom.split("");
          for (let i = 0; i < chars.length; i++) {
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
  return idioms;
}

const thresholdName = threshold ? threshold : "all";
const baseDir = `kana-${thresholdName}`;
Deno.mkdirSync(baseDir, { recursive: true });
for (let idiomLength = 3; idiomLength <= 6; idiomLength++) {
  // const idioms = await _listupFromChars(idiomLength);  // not supported
  const idioms = await listupFromWords(idiomLength);

  if (thresholdName != "all") {
    for (const word of nameList) {
      delete idioms[word];
    }
    for (const word of sexualList) {
      delete idioms[word];
    }
    for (const word of ignoreList) {
      delete idioms[word];
    }
    for (const idiom of Object.keys(idioms)) {
      if (idioms[idiom] < threshold) {
        delete idioms[idiom];
      }
    }
  }
  const arr = Object.entries(idioms);
  arr.sort(function (a, b) {
    if (a[1] < b[1]) return 1;
    if (a[1] > b[1]) return -1;
    return 0;
  });
  Deno.writeTextFile(
    `${baseDir}/${idiomLength}.lst`,
    arr.map((x) => x[0]).join("\n"),
  );
}
