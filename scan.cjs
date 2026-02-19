const fs = require('fs');
const path = require('path');

// اسم الملف الناتج
const OUTPUT_FILE = 'project_full_code.txt';

// قائمة المجلدات التي سيتم تجاهلها
const IGNORED_DIRS = [
    'node_modules', '.git', 'dist', 'build', '.vscode', '.idea', 'public', '.firebase'
];

// قائمة الملفات التي سيتم تجاهلها
const IGNORED_FILES = [
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
    OUTPUT_FILE, 'scan.cjs',
    '.DS_Store', '.env', '.env.local'
];

// امتدادات الملفات غير النصية
const BINARY_EXTENSIONS = [
    '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg',
    '.woff', '.woff2', '.ttf', '.eot', '.mp3', '.mp4', '.pdf'
];

function getAllFiles(dirPath, arrayOfFiles) {
    let files = [];
    try {
        files = fs.readdirSync(dirPath);
    } catch (err) {
        return arrayOfFiles;
    }

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        const fullPath = path.join(dirPath, file);

        try {
            if (fs.statSync(fullPath).isDirectory()) {
                if (!IGNORED_DIRS.includes(file)) {
                    arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
                }
            } else {
                const ext = path.extname(file).toLowerCase();
                if (!IGNORED_FILES.includes(file) && !BINARY_EXTENSIONS.includes(ext)) {
                    arrayOfFiles.push(fullPath);
                }
            }
        } catch (e) {
            // تجاوز الأخطاء في حال وجود ملفات نظام محمية
        }
    });

    return arrayOfFiles;
}

try {
    console.log("------------------------------------------------");
    console.log("Starting script...");
    const rootDir = __dirname;

    // 1. جمع الملفات
    const allFiles = getAllFiles(rootDir);

    // 2. إنشاء الملف النصي
    const writeStream = fs.createWriteStream(OUTPUT_FILE, { encoding: 'utf8' });

    console.log(`Found ${allFiles.length} files. Writing to ${OUTPUT_FILE}...`);

    allFiles.forEach(filePath => {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const relativePath = path.relative(rootDir, filePath);

            // كتابة الفواصل والمحتوى
            writeStream.write(`\n\n==================================================\n`);
            writeStream.write(`FILE PATH: ${relativePath}\n`);
            writeStream.write(`==================================================\n\n`);
            writeStream.write(content);

            console.log(`Processed: ${relativePath}`);
        } catch (err) {
            console.error(`Skipped: ${filePath}`);
        }
    });

    writeStream.end();
    console.log("------------------------------------------------");
    console.log(`✅ DONE! Check the file: ${OUTPUT_FILE}`);
    console.log("------------------------------------------------");

} catch (error) {
    console.error("❌ Fatal Error:", error);
}