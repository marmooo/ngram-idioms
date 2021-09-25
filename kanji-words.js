import { readLines } from "https://deno.land/std/io/mod.ts";

if (Deno.args.length < 1) {
  console.log("USAGE: kanji-words.js [idiomLength] [threshold]");
  Deno.exit(1);
}
const idiomLength = parseInt(Deno.args[0]);
const threshold = parseInt(Deno.args[1]);
const filtering = Deno.args[1] ? true : false;

const w1_ = Array.from(
  "一右雨円王音下火花貝学気九休玉金空月犬見五口校左三山子四糸字耳七車手十出女小上森人水正生青夕石赤千川先早草足村大男竹中虫町天田土二日入年白八百文木本名目立力林六",
);
const w2_ = Array.from(
  "引羽雲園遠何科夏家歌画回会海絵外角楽活間丸岩顔汽記帰弓牛魚京強教近兄形計元言原戸古午後語工公広交光考行高黄合谷国黒今才細作算止市矢姉思紙寺自時室社弱首秋週春書少場色食心新親図数西声星晴切雪船線前組走多太体台地池知茶昼長鳥朝直通弟店点電刀冬当東答頭同道読内南肉馬売買麦半番父風分聞米歩母方北毎妹万明鳴毛門夜野友用曜来里理話",
);
const w3_ = Array.from(
  "悪安暗医委意育員院飲運泳駅央横屋温化荷界開階寒感漢館岸起期客究急級宮球去橋業曲局銀区苦具君係軽血決研県庫湖向幸港号根祭皿仕死使始指歯詩次事持式実写者主守取酒受州拾終習集住重宿所暑助昭消商章勝乗植申身神真深進世整昔全相送想息速族他打対待代第題炭短談着注柱丁帳調追定庭笛鉄転都度投豆島湯登等動童農波配倍箱畑発反坂板皮悲美鼻筆氷表秒病品負部服福物平返勉放味命面問役薬由油有遊予羊洋葉陽様落流旅両緑礼列練路和",
);
const w4_ = Array.from(
  "愛案以衣位茨印英栄媛塩岡億加果貨課芽賀改械害街各覚潟完官管関観願岐希季旗器機議求泣給挙漁共協鏡競極熊訓軍郡群径景芸欠結建健験固功好香候康佐差菜最埼材崎昨札刷察参産散残氏司試児治滋辞鹿失借種周祝順初松笑唱焼照城縄臣信井成省清静席積折節説浅戦選然争倉巣束側続卒孫帯隊達単置仲沖兆低底的典伝徒努灯働特徳栃奈梨熱念敗梅博阪飯飛必票標不夫付府阜富副兵別辺変便包法望牧末満未民無約勇要養浴利陸良料量輪類令冷例連老労録",
);
const w5_ = Array.from(
  "圧囲移因永営衛易益液演応往桜可仮価河過快解格確額刊幹慣眼紀基寄規喜技義逆久旧救居許境均禁句型経潔件険検限現減故個護効厚耕航鉱構興講告混査再災妻採際在財罪殺雑酸賛士支史志枝師資飼示似識質舎謝授修述術準序招証象賞条状常情織職制性政勢精製税責績接設絶祖素総造像増則測属率損貸態団断築貯張停提程適統堂銅導得毒独任燃能破犯判版比肥非費備評貧布婦武復複仏粉編弁保墓報豊防貿暴脈務夢迷綿輸余容略留領歴",
);
const w6_ = Array.from(
  "胃異遺域宇映延沿恩我灰拡革閣割株干巻看簡危机揮貴疑吸供胸郷勤筋系敬警劇激穴券絹権憲源厳己呼誤后孝皇紅降鋼刻穀骨困砂座済裁策冊蚕至私姿視詞誌磁射捨尺若樹収宗就衆従縦縮熟純処署諸除承将傷障蒸針仁垂推寸盛聖誠舌宣専泉洗染銭善奏窓創装層操蔵臓存尊退宅担探誕段暖値宙忠著庁頂腸潮賃痛敵展討党糖届難乳認納脳派拝背肺俳班晩否批秘俵腹奮並陛閉片補暮宝訪亡忘棒枚幕密盟模訳郵優預幼欲翌乱卵覧裏律臨朗論",
);
// https://okjiten.jp/7-tyuugakuseikanji.html
// 漢検4級
const w7_ = Array.from(
  "握扱依威偉為違緯維壱芋隠陰鋭影越援縁煙鉛汚押奥憶菓箇暇雅介壊戒皆較獲刈甘監汗歓勧乾鑑環含奇鬼祈輝幾儀戯詰脚却丘及朽拠巨距御驚凶恐響叫狭狂況仰駆屈掘繰傾恵迎撃肩堅遣兼軒圏剣玄誇鼓枯継互更荒抗攻稿香恒項豪込婚鎖歳彩載剤咲惨雌伺紫刺脂旨執芝煮斜釈寂狩朱趣需秀舟襲柔獣瞬巡旬盾紹召沼詳床称畳丈飾殖触浸震慎侵寝振薪陣尽尋吹是征姓井跡扇占鮮訴燥騒僧贈即俗耐替拓沢濁脱丹端嘆淡弾恥遅致蓄沖跳徴澄珍沈抵堤摘滴添殿途吐渡奴怒透唐桃盗塔到倒逃踏稲闘胴峠突鈍曇弐悩濃輩杯泊拍迫薄爆髪抜罰繁販搬範般盤被疲彼避尾微匹描浜敏怖膚浮腐敷普賦舞幅払噴柄壁捕舗峰抱砲肪坊忙冒傍帽凡盆漫慢妙眠矛霧娘茂網猛黙紋踊雄与誉腰溶躍謡翼雷頼絡欄離粒慮療隣涙隷麗齢暦劣烈恋露郎惑腕",
);
// 漢検3級
const w8_ = Array.from(
  "哀慰詠悦閲炎宴欧殴乙卸穏架佳華嫁餓怪悔塊概慨該穫隔郭岳掛滑勘肝貫敢緩冠換喚企軌棄棋忌既岐騎犠欺菊吉喫虐虚脅峡凝緊斤愚偶遇啓鶏携掲刑憩契鯨賢倹幻雇顧弧孤悟娯甲孔控拘郊硬綱巧坑慌絞酵克獄魂紺恨墾催債削錯搾撮擦暫施祉諮侍慈軸湿疾赦邪殊寿潤遵徐如晶掌鐘焦衝昇匠譲錠嬢冗嘱辱審伸辛粋炊遂衰穂酔随髄瀬牲婿請隻惜斥籍摂潜繕措阻粗礎双桑葬掃遭憎促賊逮胎怠滞袋滝託卓択諾奪胆鍛壇稚畜窒駐抽鋳彫超聴陳鎮墜訂帝締哲斗塗陶凍痘匿篤豚尿粘婆排陪縛伐帆伴藩畔蛮泌卑碑姫漂苗赴符封伏覆墳紛癖募慕簿崩芳胞縫倣邦飽奉妨乏謀膨房某墨没翻魔埋膜又魅滅免幽憂誘擁揚揺抑裸濫吏隆了猟陵糧厘零霊励裂錬廉炉漏廊浪楼湾",
);
const w9_ = Array.from(
  "亜尉逸姻韻畝浦疫謁猿凹翁虞渦禍靴寡稼蚊拐懐劾涯垣核殻嚇潟括喝渇褐轄且缶陥患堪棺款閑寛憾還艦頑飢宜偽擬糾窮拒享挟恭矯暁菌琴謹襟吟隅勲薫茎渓蛍慶傑嫌献謙繭顕懸弦呉碁江肯侯洪貢溝衡購拷剛酷昆懇佐唆詐砕宰栽斎崎索酢桟傘肢嗣賜滋璽漆遮蛇酌爵珠儒囚臭愁酬醜汁充渋銃叔淑粛塾俊准殉循庶緒叙升抄肖尚宵症祥渉訟硝粧詔奨彰償礁浄剰縄壌醸津唇娠紳診刃迅甚帥睡枢崇据杉斉逝誓析拙窃仙栓旋践遷薦繊禅漸租疎塑壮荘捜挿曹喪槽霜藻妥堕惰駄泰濯但棚痴逐秩嫡衷弔挑眺釣懲勅朕塚漬坪呈廷邸亭貞逓偵艇泥迭徹撤悼搭棟筒謄騰洞督凸屯軟尼妊忍寧把覇廃培媒賠伯舶漠肌鉢閥煩頒妃披扉罷猫賓頻瓶扶附譜侮沸雰憤丙併塀幣弊偏遍泡俸褒剖紡朴僕撲堀奔麻摩磨抹岬銘妄盲耗厄愉諭癒唯悠猶裕融庸窯羅酪痢履柳竜硫虜涼僚寮倫累塁戻鈴賄枠挨曖宛嵐畏萎椅彙茨咽淫唄鬱怨媛艶旺岡臆俺苛牙瓦楷潰諧崖蓋骸柿顎葛釜鎌韓玩伎亀毀畿臼嗅巾僅錦惧串窟熊詣憬稽隙桁拳鍵舷股虎錮勾梗喉乞傲駒頃痕沙挫采塞埼柵刹拶斬恣摯餌鹿叱嫉腫呪袖羞蹴憧拭尻芯腎須裾凄醒脊戚煎羨腺詮箋膳狙遡曽爽痩踪捉遜汰唾堆戴誰旦綻緻酎貼嘲捗椎爪鶴諦溺填妬賭藤瞳栃頓貪丼那奈梨謎鍋匂虹捻罵剥箸氾汎阪斑眉膝肘阜訃蔽餅璧蔑哺蜂貌頬睦勃昧枕蜜冥麺冶弥闇喩湧妖瘍沃拉辣藍璃慄侶瞭瑠呂賂弄籠麓脇",
);
const w1 = w1_;
const w2 = w2_.concat(w1);
const w3 = w3_.concat(w2);
const w4 = w4_.concat(w3);
const w5 = w5_.concat(w4);
const w6 = w6_.concat(w5);
const w7 = w7_.concat(w6);
const w8 = w8_.concat(w7);
const w9 = w9_.concat(w8);
const learnedKanjis = [w1, w1, w2, w3, w4, w5, w6, w7, w8, w9];
const gradeByKanjis = [w1_, w1_, w2_, w3_, w4_, w5_, w6_, w7_, w8_, w9_];
const mergeNum = 2; // 形態素の結合数 (2以上はノイズあり)

const nameList = Deno.readTextFileSync("ignore-family-name.lst").split("\n");
const sexualList = Deno.readTextFileSync("inappropriate-words-ja/Sexual.txt")
  .split("\n");
const ignoreList = Deno.readTextFileSync("ignore" + idiomLength + ".lst").split(
  "\n",
);

function _isBeginnerWord(word, level) {
  let count = 0;
  const chars = word.split("");
  for (let i = 0; i < chars.length; i++) {
    if (level < 10) {
      if (gradeByKanjis[level].includes(chars[i])) {
        count += 1;
        if (count > 1) return false;
      }
    } else {
      if (!/[\u4E00-\u9FFF]/.test(chars[i])) {
        count += 1;
        if (count > 1) return false;
      }
    }
  }
  if (count == 1) {
    return true;
  } else {
    return false;
  }
}

function isValidIdiom(word, level) {
  const chars = word.split("");
  for (let i = 0; i < chars.length; i++) {
    if (level < 10) {
      if (!learnedKanjis[level].includes(chars[i])) {
        return false;
      }
    } else {
      if (!/[\u4E00-\u9FFF]/.test(chars[i])) {
        return false;
      }
    }
  }
  return true;
}

function filter(idiom) {
  if (idiom.length == 2) {
    if (idiom[0] == idiom[1]) {
      return true;
    }
    if (/[一二三四五六七八九十百千万]/.test(idiom[0])) { // 一目, 三文
      return true;
    }
  } else if (idiom.length == 3) {
    if (idiom[0] == idiom[1] && idiom[1] == idiom[2]) {
      return true;
    }
    if (/[前後中別率性度時可系用編市区町村郡港橋山岳川谷島寺]/.test(idiom[idiom.length - 1])) {
      // どんな語句にも繋がる語尾、固有名詞になる語尾は削除  / TODO: 派駅川
      // 川→神奈川が消えることに注意
      return true;
    }
    if (/[左右東西南北内外者名様等共何的氏来他日歳毎板]/.test(idiom[idiom.length - 1])) {
      // 問題としてつまらない (意味に変化がない) 語尾は削除  // TODO: 化上下
      return true;
    }
    if (/[各御元第別他]/.test(idiom[0])) {
      // 問題としてつまらない接頭辞は削除  // TODO: 当
      return true;
    }
    if (/^[一二三四五六七八九十百千万]{3}/.test(idiom)) {
      return true;
    }
    if (/[一二三四五六七八九十百千万何数][話章部節曲人点番回度年月日号円点曲色発歩枚条位級列社丁]/.test(idiom)) {
      return true;
    }
  }
  return false;
}

// 日帰「り」などで不自然な熟語が発生 --> 形態素解析版がより優れる
async function _listupFromChars(level) {
  const idioms = {};
  const fileReader = await Deno.open(
    "nwc2010-ngrams/char/over999/5gms/5gm.lst",
  );
  for await (const line of readLines(fileReader)) {
    const arr = line.split(/\s/); // <S>, </S> に注意が必要
    if (!/[0-9\u4E00-\u9FFF]/.test(arr[0])) { // 1学年,2年生などを排除
      const idiom = arr.slice(1, idiomLength + 1).join("");
      if (!/[0-9\u4E00-\u9FFF]/.test(arr[idiomLength + 1])) {
        // if (isValidIdiom(idiom, level) && isBeginnerWord(idiom, level)) {
        if (isValidIdiom(idiom, level)) {
          const filtered = false;
          if (filtering) {
            filtered = filter(idiom);
          }
          if (!filtered) {
            const count = parseInt(arr[arr.length - 1]);
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

async function listupFromWords(level) {
  const idioms = {};
  const fileReader = await Deno.open(
    "nwc2010-ngrams/word/over999/5gms/5gm.lst",
  );
  for await (const line of readLines(fileReader)) {
    const morphemes = line.split(/\s/);
    const count = parseInt(morphemes[morphemes.length - 1]);
    if (!/[0-9\u4E00-\u9FFF]/.test(morphemes[0])) { // 1学年,2年生などを排除
      for (let m = 2; m < mergeNum + 2; m++) {
        const idiom = morphemes.slice(1, m).join("");
        if (
          idiom.length == idiomLength &&
          !/[0-9\u4E00-\u9FFF]/.test(morphemes[m])
        ) {
          // if (isValidIdiom(idiom, level) && isBeginnerWord(idiom, level)) {
          if (isValidIdiom(idiom, level)) {
            let filtered = false;
            if (filtering) {
              filtered = filter(idiom);
            }
            if (!filtered) {
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
  }
  return idioms;
}

const thresholdName = threshold ? threshold : "all";
const baseDir = `kanji2-${idiomLength}-${thresholdName}`;
Deno.mkdirSync(baseDir, { recursive: true });
for (let level = 1; level <= 10; level++) {
  // const idioms = await _listupFromChars(level);
  const idioms = await listupFromWords(level);

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
    `${baseDir}/${level}.lst`,
    arr.map((x) => x[0]).join("\n"),
  );
}
