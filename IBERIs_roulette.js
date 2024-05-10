// 表示するための声優の名前（画像ファイル名、表示名）を格納する配列を定義する
const mainVaList = [
      ["ikeda_momoka"   , "池田 百々香", 0]
    , ["ohashi_misaki"  , "大橋 海咲"  , 0]
    , ["ogawa_hanaka"   , "小川 華果"  , 0]
    , ["sonoda_rei"     , "園田 れい"  , 0]
    , ["nishio_momoko"  , "西尾 桃子"  , 0]
    , ["hamazaki_nanami", "浜崎 七海"  , 0]
    , ["hinano"         , "日菜"       , 0]
    , ["minami_haruka"  , "三波 春香"  , 0]
];
const mainFolder = "main";

// 選択された配列indexを格納する配列を定義する
var selectedIndexList = [];

// ルーレット動作状況を管理する配列を定義する
var roulettes = [];

/* ルーレットを回転 */
function spinRoulette(rouletteId) {
    var randomIndex;
    var len = mainVaList.length;

    // 声優リストからランダムなindexを取得
    randomIndex = Math.floor(Math.random() * len);
    // ルーレットにindexの声優の画像、名前を表示
    displayVa(rouletteId, randomIndex);
}

/* 声優の画像、名前を表示する */
function displayVa(rouletteId, index, isSpecial = false) {
    var image;
    var name;

    if (!isSpecial)
    {
        image = "./images/" + mainFolder + "/" + mainVaList[index][0] + ".jpg";
        name = mainVaList[index][1];
    }

    // 画像を表示する
    document.getElementById("image-container-" + rouletteId).innerHTML = "<img src='" + image + "' width='200'>";
    // 名前を表示する
    document.getElementById("name-container-" + rouletteId).innerHTML = "<p>" + name + "</p>";
}

/* ルーレットを開始 */
function start() {
    for (let rouletteId = 1; rouletteId <= 3; rouletteId++) {
        // 100ミリ秒ごとに1回ルーレットを回転させる（回転数を上げる場合は末尾の引数の数値を変更）
        roulettes.push(setInterval(function () { spinRoulette(rouletteId) }, 100));

        // ストップボタンON
        document.getElementById("stop-" + rouletteId).disabled = false;
    }

    // スタートボタンOFF
    document.getElementById("start").disabled = true;
}

/* ルーレットを停止 */
function stop(rouletteId) {
    if (roulettes[rouletteId - 1]) {
        // ルーレットの回転を停止する
        clearInterval(roulettes[rouletteId - 1]);
    }

    // ストップボタンOFF
    document.getElementById("stop-" + rouletteId).disabled = true;
}

/* リセット */
function reset() {
    // スタートボタンON
    document.getElementById("start").disabled = false;

    for (let rouletteId = 1; rouletteId <= 3; rouletteId++) {
        // 停止処理（ストップボタンOFF含む）
        stop(rouletteId);
        // 画像、名前リセット
        document.getElementById("image-container-" + rouletteId).innerHTML = "<img src='./images/start.jpg' width='200'>";
        document.getElementById("name-container-" + rouletteId).innerHTML = "<p>推し" + rouletteId + "</p>";
    }
    // ルーレット動作状況リセット
    roulettes = [];
}

// ページ読み込み時に実行
window.onload = function () {
    // リセット処理
    reset();
}
