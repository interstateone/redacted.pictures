var fabric = require('fabric').fabric;

function weightedRandom() {
    return Math.pow(Math.random(), 2);
}

function unredactedWord(length) {
    var count = length
    var word = ""
    do {
        word += "█"
        count -= 1
    } while (count >= 0)

    return word;
}

function randomRedactedWord() {
    return unredactedWord(2 + weightedRandom() * 6);
}

function randomRedactedSentenceFragment() {
    var words = []
    var count = 2 + Math.random() * 10
    for (var index = 0; index < count; index += 1) {
        words.push(randomRedactedWord())
    }
    return words;
}

function wrapText(canvas, words, x, y, maxWidth, lineHeight) {
    var line = '';

    for (var n = 0; n < words.length; n++) {
        var testLine = line + words[n] + ' ';

        var text = new fabric.Text(testLine, {
            left: x,
            top: y,
            fontSize: 14,
            fontFamily: 'DejaVu Serif'
        });

        var testWidth = text.width;
        if (testWidth > maxWidth && n > 0) {
            canvas.add(text);
            line = '';
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }

    var text = new fabric.Text(line, {
        left: x,
        top: y,
        fontSize: 14,
        fontFamily: 'DejaVu Serif'
    });
    canvas.add(text);

    // Resize to fit the text
    canvas.setHeight(y + lineHeight);
    canvas.renderAll();

    return canvas;
}

function unredact(words) {
    var paragraph = randomRedactedSentenceFragment();
    for (index in words) {
        var word = words[index];
        paragraph.push(word)
        paragraph = paragraph.concat(randomRedactedSentenceFragment())
    }

    var canvas = fabric.createCanvasForNode(600, 200);
    return wrapText(canvas, paragraph, 0, 14, 300, 20);
}

module.exports = { 'unredact': unredact };
