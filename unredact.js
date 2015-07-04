var fabric = require('fabric').fabric;

function weightedRandom() {
    return Math.pow(Math.random(), 2);
}

function unredactedWord(length) {
    if (length < 0) {
        length = 1;
    }

    var count = length;
    var word = "";
    do {
        word += "█";
        count -= 1;
    } while (count >= 0);

    return word;
}

function randomRedactedWord() {
    return unredactedWord(2 + weightedRandom() * 6);
}

function randomRedactedSentenceFragment() {
    var words = [];
    var count = 2 + Math.random() * 10;
    for (var index = 0; index < count; index += 1) {
        words.push(randomRedactedWord());
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
    // Don't kill the server
    if (words.length > 50) {
        words.length = 50;
    }
    
    var paragraph = randomRedactedSentenceFragment();
    for (index in words) {
        var word = words[index];

        // Don't kill it here either
        if (word.length > 25) {
            word = word.substring(0, 25);
        }

        paragraph.push(word);
        paragraph = paragraph.concat(randomRedactedSentenceFragment());
    }

    var canvas = fabric.createCanvasForNode(400, 200);
    canvas = wrapText(canvas, paragraph, 5, 5, 300, 20);
    canvas.insertAt(new fabric.Rect({ width: canvas.getWidth(), height: canvas.getHeight(), fill: "white" }), 0);

    return canvas;
}

module.exports = { 'unredact': unredact };
