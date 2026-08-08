const fs = require('fs'); 
const lines = fs.readFileSync('translations.ts', 'utf8').split('\n'); 
const fixedLines = []; 
const seenKeys = new Set(); 
let currentLang = null; 
for (let i = 0; i < lines.length; i++) { 
    const line = lines[i].trimEnd(); 
    if (line.match(/^\s*(en|ar|ru):\s*\{\s*$/)) { 
        currentLang = line.match(/^\s*(en|ar|ru):\s*\{\s*$/)[1]; 
        seenKeys.clear(); 
        fixedLines.push(line); 
        continue; 
    } 
    if (line.match(/^\s*\},?\s*$/) && currentLang) { 
        currentLang = null; 
        seenKeys.clear(); 
        fixedLines.push(line); 
        continue; 
    } 
    if (currentLang) { 
        const match = line.match(/^\s*([a-zA-Z0-9_]+)\s*:/); 
        if (match) { 
            const key = match[1]; 
            if (seenKeys.has(key)) { 
                continue; 
            } else { 
                seenKeys.add(key); 
                fixedLines.push(line); 
                continue; 
            } 
        } 
    } 
    if (i === 0 || !line.includes('export const translations = {')) { 
        fixedLines.push(line); 
    } 
} 
for (let i = 0; i < fixedLines.length - 1; i++) { 
    const line = fixedLines[i]; 
    const nextLine = fixedLines[i+1].trim(); 
    if (line.match(/^\s*[a-zA-Z0-9_]+\s*:.*\"$/)) { 
        if (!nextLine.startsWith('}') && nextLine !== '') { 
            fixedLines[i] = line + ','; 
        } 
    } 
} 
fs.writeFileSync('translations.ts', fixedLines.join('\n'));
