function ChangeColor() {
    var backColor = document.getElementById("back_color").value;
    var patternColor = document.getElementById("pattern_color").value;

    if (test_color(backColor)) {
        document.getElementById("radius").style.backgroundColor = backColor;
    }
    if (test_color(patternColor)) {
        document.getElementById("radius").style.color = patternColor;
    }
}

function test_color(color) {
    return color.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/) !== null;
}

// ページ読み込み時に実行
window.onload = function () {
    ChangeColor();
}
