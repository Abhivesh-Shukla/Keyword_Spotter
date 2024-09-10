const fs = require('fs');
const pdfParse = require('pdf-parse');

const extractTOC = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);

    console.log(`Total pages in PDF: ${pdfData.numpages}`);

  
    const numPages = Math.min(pdfData.numpages, 4);
    let tocText = pdfData.text;

    // Log the extracted text to understand its structure
    console.log('Extracted TOC Text:', tocText);

    const chapterPattern = /CHAPTER\s+\d+:\s+[^\n]+/gi;
    const sectionPattern = /(?:CHAPTER\s+\d+:\s+[^\n]+|^[A-Z][^\n]*$)/gm;

    const chapters = tocText.match(chapterPattern) || [];
    const sections = tocText.match(sectionPattern) || [];

    return { chapters, sections };
  } catch (error) {
    console.error('Error extracting TOC:', error);
  }
};

const main = async () => {
  const filePath = '/Users/abhivesh/Downloads/Book.pdf';
  const toc = await extractTOC(filePath);
  console.log('Table of Contents:', toc);
};

main();
