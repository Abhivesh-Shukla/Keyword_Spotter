const fs = require('fs');
const pdf = require('pdf-parse');

let pdfBuffer = fs.readFileSync('/Users/abhivesh/Downloads/Book.pdf');

pdf(pdfBuffer).then(function(data) {
    const text = data.text;

    const chapters = [];
    
    // Regular expression to capture chapter titles
    const chapterRegex = /CHAPTER \d+:.*?$/gm;

    // Extract chapters
    let chapterMatch;
    while ((chapterMatch = chapterRegex.exec(text)) !== null) {
        chapters.push(chapterMatch[0].trim());
    }

    // Format output
    console.log("Chapters:");
    console.log(chapters.join('\n'));
});
