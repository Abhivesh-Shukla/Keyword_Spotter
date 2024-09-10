const fs = require('fs');
const pdf = require('pdf-parse');
const readline = require('readline');

const PDF_PATH = 'book.pdf';

// Function to extract table of contents structure
function extractTableOfContents(text) {
    const lines = text.split('\n');
    const contents = [];
    let currentChapter = '';
    let currentSections = [];

    lines.forEach((line) => {
        // Match chapter heading
        const chapterMatch = line.match(/^CHAPTER\s+\d+:?\s+(.*)/i);
        if (chapterMatch) {
            // Push previous chapter if exists
            if (currentChapter && currentSections.length > 0) {
                contents.push({ chapter: currentChapter.trim(), sections: currentSections });
            }
            // Initialize new chapter
            currentChapter = chapterMatch[1];
            currentSections = [];
        } else if (currentChapter && line.trim() !== '') {
            // Match section
            const sectionMatch = line.match(/^\s*(.*?)\s*$/);
            if (sectionMatch) {
                currentSections.push(sectionMatch[1]);
            }
        }
    });

    // Push the last chapter if exists
    if (currentChapter && currentSections.length > 0) {
        contents.push({ chapter: currentChapter.trim(), sections: currentSections });
    }

    return contents;
}

// Function to search for chapters and sections containing the word
function findChaptersAndSections(contents, word) {
    const results = [];

    contents.forEach((entry) => {
        const chapter = entry.chapter;
        entry.sections.forEach((section) => {
            const regex = new RegExp(`\\b${word}\\b`, 'i');
            if (regex.test(section)) {
                results.push({ chapter, section });
            }
        });
    });

    return results;
}

// Function to handle PDF reading and searching
function readPDF(filePath, word, rl) {
    const dataBuffer = fs.readFileSync(filePath);

    pdf(dataBuffer).then(function(data) {
        // Extract text from PDF
        const text = data.text;

        // Extract table of contents from text
        const contents = extractTableOfContents(text);

        // Find chapters and sections containing the word
        const results = findChaptersAndSections(contents, word);

        console.log(`Total results found: ${results.length}`);
        if (results.length > 0) {
            results.forEach(result => {
                console.log(`Chapter: ${result.chapter}`);
                console.log(`Section: ${result.section}`);
                console.log('---');
            });
        } else {
            console.log(`The word "${word}" was not found in any chapters or sections.`);
        }

        // Ask for another word to search
        askForWord(rl);
    }).catch(err => {
        console.error('Error reading PDF:', err);
        // Ask for another word to search even if there's an error
        askForWord(rl);
    });
}

// Function to ask the user for a new word to search
function askForWord(rl) {
    rl.question('Enter a word to search in the PDF (or type "exit" to quit): ', (word) => {
        if (word.toLowerCase() === 'exit') {
            rl.close();
        } else if (word) {
            readPDF(PDF_PATH, word, rl);
        } else {
            console.log('You must enter a word to search.');
            askForWord(rl);
        }
    });
}

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Start the first word search
askForWord(rl);
