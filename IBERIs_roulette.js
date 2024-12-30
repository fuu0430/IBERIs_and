/* グローバル変数定義 */
// 表示するための声優の名前（画像ファイル名、表示名）を格納する配列定数
const mainVaList = [
      { number:"1", nameRoman:"ikeda_momoka"   , nameJa:"池田 百々香", isSpecial:0}
    , { number:"2", nameRoman:"ohashi_misaki"  , nameJa:"大橋 海咲"  , isSpecial:0}
    , { number:"3", nameRoman:"ogawa_hanaka"   , nameJa:"小川 華果"  , isSpecial:0}
    , { number:"4", nameRoman:"sonoda_rei"     , nameJa:"園田 れい"  , isSpecial:0}
    , { number:"5", nameRoman:"nishio_momoko"  , nameJa:"西尾 桃子"  , isSpecial:0}
    , { number:"6", nameRoman:"hamazaki_nanami", nameJa:"浜崎 七海"  , isSpecial:0}
    , { number:"7", nameRoman:"hinano"         , nameJa:"日菜"       , isSpecial:0}
    , { number:"8", nameRoman:"minami_haruka"  , nameJa:"三波 春香"  , isSpecial:0}
];

// メインフォルダのフォルダ名
const mainFolder = "main";

// オプション：選択メンバー配列
var checkMembers = [];

// オプション：ルーレット数
var rouletteNum;

// オプション：重複フラグ
var isduplicate = false;

// ルーレットID毎の配列
var roulette1List = [];
var roulette2List = [];
var roulette3List = [];

// ルーレット動作状況を管理する配列
var roulettes = [];

/* ルーレットを回転 */
function spinRoulette(rouletteId) {
    var randomIndex;
    var tempList = getRouletteList(rouletteId);
    var len = tempList.length;

    // 声優リストからランダムなindexを取得
    randomIndex = Math.floor(Math.random() * len);
    // ルーレットにindexの声優の画像、名前を表示
    displayVa(rouletteId, tempList[randomIndex].number);
}

/* 声優の画像、名前を表示する */
function displayVa(rouletteId, number, isSpecial = false) {
    var va = mainVaList.find(list => number.includes(list.number));
    var image;
    var name;

    if (!isSpecial) {
        image = "./images/" + mainFolder + "/" + va.nameRoman + ".jpg";
        name = va.nameJa;
    }

    // 画像を表示する
    $("#image-container-" + rouletteId).html("<img src='" + image + "' width='300'>");
    // 名前を表示する
    $("#name-container-" + rouletteId).html("<p>" + name + "</p>");
    $("#number-container-" + rouletteId).val(number);
}

/* ルーレットを開始 */
function start() {
    for (let rouletteId = 1; rouletteId <= rouletteNum; rouletteId++) {
        // 100ミリ秒ごとに1回ルーレットを回転させる（回転数を上げる場合は末尾の引数の数値を変更）
        roulettes.push(setInterval(function () { spinRoulette(rouletteId) }, 100));

        // ストップボタンON
        document.getElementById("stop-" + rouletteId).disabled = false;
    }

    // スタートボタンOFF
    document.getElementById("start").disabled = true;

    // 設定変更ボタンOFF
    document.getElementById("apprySetting").disabled = true;
}

/* ルーレットを停止 */
function stop(rouletteId, isInit = false) {
    if (roulettes[rouletteId - 1]) {
        // ルーレットの回転を停止する
        clearInterval(roulettes[rouletteId - 1]);
    }

    // 重複なしの場合は停止したルーレットの選択結果を回転中の他ルーレットから除外する（リセット処理による初期化呼び出し時を除く）
    if (!isInit && !isduplicate) {
        var selectedNumber = $("#number-container-" + rouletteId).val();
        for (let i = 1; i <= rouletteNum; i++) {
            if (i != rouletteId) {
                // 各ルーレット配列にオプション設定の選択メンバーを元に絞り込み
                setRouletteList(i, getRouletteList(rouletteId).filter(list => list.number != selectedNumber));
            }
        }
    }

    // ストップボタンOFF
    document.getElementById("stop-" + rouletteId).disabled = true;
}

/* リセット */
function reset() {
    // スタートボタンON
    document.getElementById("start").disabled = false;

    // 設定変更ボタンON
    document.getElementById("apprySetting").disabled = false;

    for (let rouletteId = 1; rouletteId <= rouletteNum; rouletteId++) {
        // 停止処理（ストップボタンOFF含む初期化処理）
        stop(rouletteId, true);

        // 画像、名前リセット
        $("#image-container-" + rouletteId).html("<img src='./images/start.jpg' width='300'>");
        $("#name-container-" + rouletteId).html("<p>推し" + rouletteId + "</p>");
        $("#number-container-" + rouletteId).val("");

        // 各ルーレット配列にオプション設定の選択メンバーを元に絞り込み
        setRouletteList(rouletteId, mainVaList.filter(list => checkMembers.includes(list.number)));
    }
    // ルーレット動作状況リセット
    roulettes = [];
}

/* 設定反映 */
function apprySetting() {
    // 選択メンバーを配列に設定
    checkMembers = [];
    var tempCheckMembers = [];
    $('input[name="members"]:checked').each(function() {
        tempCheckMembers.push($(this).val()); // 配列に値を追加
    });
    // 選択メンバーエラーチェック
    if ($('#isDuplicate').prop("checked")) {
        // 重複ありの場合は1人以上選択されていない場合はエラー
        if (tempCheckMembers.length == 0) {
            alert("エラー\r\nメンバー：最低1人は選択してください");
            return;
        }
    } else {
        // 重複なしの場合はルーレットの数の人数分以上選択されていない場合はエラー
        if (tempCheckMembers.length < $('#rouletteNum').val()) {
            alert("エラー\r\nメンバー：最低" + $('#rouletteNum').val() + "人は選択してください");
            return;
        }
    }
    // 選択メンバーをグローバル変数に設定
    checkMembers = tempCheckMembers;

    // ルーレット数をグローバル変数に設定
    rouletteNum = $('#rouletteNum').val();

    // 重複フラグをグローバル変数に設定
    isduplicate = $('#isDuplicate').prop("checked");

    for (let rouletteId = 1; rouletteId <= 3; rouletteId++) {
        if (rouletteNum - rouletteId >= 0) {
            // ルーレット数変更（表示）
            $('.roulette-' + String(rouletteId)).show();
            // 各ルーレット配列にメイン配列をコピー
            setRouletteList(rouletteId, mainVaList);
        } else {
            // ルーレット数変更（非表示）
            $('.roulette-' + String(rouletteId)).hide();
            // 各ルーレット配列に空を設定（未使用）
            setRouletteList(rouletteId, []);
        }
    }

    // リセット処理
    reset();
}

$(function() {
    // チェックボックスの全選択・解除
    $('#check_all').on('change', function() {
        // 「選択肢」のチェック状態を切替える
        $('.member').prop('checked', $(this).is(':checked'));
    });
    $('.member').on('change', function() {
        // 「全選択」のチェック状態を切替える
        if ($('#members :checked').length == $('#members :input').length){
            $('#check_all').prop('checked', true);
        }else{
            $('#check_all').prop('checked', false);
        }
    });

    // トグル制御（オプション設定）
    $('#optionSetting').on('click', function () {
        $('#opptions').slideToggle(toggleFunc);
    });
    //  オプション設定の開閉文字変更
    function toggleFunc() {
        if ($(this).css('display') == 'block') {
            $("#toggleMessage").text("▲");
        }else{
            $("#toggleMessage").text("▼");
        }
    };
});

// ルーレットIDに該当するルーレット配列を取得（コピーのため参照渡しにはならない）
function getRouletteList(rouletteId) {
    if (rouletteId == 1) {
        return [...roulette1List];
    } else if (rouletteId == 2) {
        return [...roulette2List];
    } else if (rouletteId == 3) {
        return [...roulette3List];
    } else {
        return null;
    }
}

// ルーレットIDに該当するルーレット配列へ値を設定する（コピーのため参照渡しにはならない）
function setRouletteList(rouletteId, list) {
    if (rouletteId == 1) {
        roulette1List = [...list];
    } else if (rouletteId == 2) {
        roulette2List = [...list];
    } else if (rouletteId == 3) {
        roulette3List = [...list];
    }
}

// ページ読み込み時に実行
window.onload = function () {
    // 設定反映処理（リセット処理含む）
    apprySetting();
}
