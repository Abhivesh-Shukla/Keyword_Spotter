const fs = require('fs');
const pdf = require('pdf-parse');
const readline = require('readline');

const PDF_PATH = 'book.pdf';

// Predefined table of contents structure
const tableOfContents = [
    { chapter: 'CHAPTER 1: Don’t Try', sections: ['The Feedback Loop from Hell', 'The Subtle Art of Not Giving a Fuck', 'So Mark, What the Fuck Is the Point of This Book Anyway?'] },
    { chapter: 'CHAPTER 2: Happiness Is a Problem', sections: ['The Misadventures of Disappointment Panda', 'Happiness Comes from Solving Problems', 'Emotions Are Overrated', 'Choose Your Struggle'] },
    { chapter: 'CHAPTER 3: You Are Not Special', sections: ['Things Fall Apart', 'The Tyranny of Exceptionalism', 'B-b-b-but, If I’m Not Going to Be Special or Extraordinary, What’s the Point?'] },
    { chapter: 'CHAPTER 4: The Value of Suffering', sections: ['The Self-Awareness Onion', 'Rock Star Problems', 'Shitty Values', 'Defining Good and Bad Values'] },
    { chapter: 'CHAPTER 5: You Are Always Choosing', sections: ['The Choice', 'The Responsibility/Fault Fallacy', 'Responding to Tragedy', 'Genetics and the Hand We’re Dealt', 'Victimhood Chic', 'There Is No “How”'] },
    { chapter: 'CHAPTER 6: You’re Wrong About Everything (But So Am I)', sections: ['Architects of Our Own Beliefs', 'Be Careful What You Believe', 'The Dangers of Pure Certainty', 'Manson’s Law of Avoidance', 'Kill Yourself', 'How to Be a Little Less Certain of Yourself'] },
    { chapter: 'CHAPTER 7: Failure Is the Way Forward', sections: ['The Failure/Success Paradox', 'Pain Is Part of the Process', 'The “Do Something” Principle'] },
    { chapter: 'CHAPTER 8: The Importance of Saying No', sections: ['Rejection Makes Your Life Better', 'Boundaries', 'How to Build Trust', 'Freedom Through Commitment'] },
    { chapter: 'CHAPTER 9: . . . And Then You Die', sections: ['Something Beyond Our Selves', 'The Sunny Side of Death'] }
];

// Function to search for chapters and sections containing the word
function findChaptersAndSections(text, word) {
    const results = [];
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    const textLines = text.split('\n');
    let currentChapter = '';
    let currentSection = '';
    
    textLines.forEach((line) => {
        tableOfContents.forEach((entry) => {
            if (line.trim() === entry.chapter) {
                currentChapter = entry.chapter;
                currentSection = '';
            }
            
            entry.sections.forEach((section) => {
                if (line.trim() === section) {
                    currentSection = section;
                }
            });
        });

        if (regex.test(line)) {
            results.push({
                chapter: currentChapter,
                section: currentSection || 'Unknown Section'
            });
        }
    });

    // Remove duplicates
    const uniqueResults = results.filter((result, index, self) =>
        index === self.findIndex((r) => (
            r.chapter === result.chapter && r.section === result.section
        ))
    );

    return uniqueResults;
}

// Read and parse the PDF
function readPDF(filePath, word) {
    const dataBuffer = fs.readFileSync(filePath);

    pdf(dataBuffer).then(function (data) {
        const text = data.text;

        // Find chapters and sections containing the word
        const results = findChaptersAndSections(text, word);

        console.log(`Total results found: ${results.length}`);
        if (results.length > 0) {
            results.forEach(result => {
                console.log(`Chapter: ${result.chapter || 'Unknown'}`);
                console.log(`Section: ${result.section || 'Unknown'}`);
                console.log('---');
            });
        } else {
            console.log(`The word "${word}" was not found in any chapters or sections.`);
        }

        // Ask user for another word to search
        askForWord();
    }).catch(err => {
        console.error('Error reading PDF:', err);
        // Ask user for another word to search
        askForWord();
    });
}

// Create readline interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to ask user for the word to search
function askForWord() {
    rl.question('Enter a word to search in the PDF (or type "exit" to quit): ', (word) => {
        if (word.toLowerCase() === 'exit') {
            rl.close();
        } else if (word) {
            readPDF(PDF_PATH, word);
        } else {
            console.log('You must enter a word to search.');
            askForWord();
        }
    });
}

// Start the first word search
askForWord();
