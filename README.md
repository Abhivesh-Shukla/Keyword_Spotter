# PDF Table of Contents Extractor

This project extracts the table of contents (TOC) from a PDF and identifies chapters and sections using regular expressions. It parses the PDF and logs the TOC, making it easier to navigate through the document.

## Features

- Extracts text from a PDF file using `pdf-parse`.
- Detects chapters and sections in the TOC based on customizable patterns.
- Logs the extracted TOC for easy review and debugging.
- Configurable to limit the number of pages parsed for efficiency.
  
## Installation

### Prerequisites

- Node.js (>= 12.x)
- npm (or yarn)

### Setup

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/pdf-toc-extractor.git
   cd pdf-toc-extractor
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Usage
1. Place your PDF file in the project directory, or provide the full path to the PDF file.
   
2. Update the filePath in the main() function within index.js to point to the PDF you want to process:
    ```bash
   const filePath = '/path/to/your/book.pdf';
   ```
3. Run the script:
   ```bash
   node index.js
   ```
4. The script will output the number of pages in the PDF and the extracted chapters and sections.

### Configuration
You can modify the regular expressions used to extract chapters and sections in the extractTOC function. Adjust the following patterns based on your PDF structure:

 ```bash
const chapterPattern = /CHAPTER\s+\d+:\s+[^\n]+/gi;
const sectionPattern = /(?:CHAPTER\s+\d+:\s+[^\n]+|^[A-Z][^\n]*$)/gm;
  ```

### Dependencies
