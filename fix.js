const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            if (!file.includes('node_modules') && !file.includes('.next')) {
                results = results.concat(walk(file));
            }
        } else { 
            if (file.endsWith('.tsx') || file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk('./frontend-app/app');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace double quotes e.g. "http://127.0.0.1:8000/api/login" -> `${process.env.NEXT_PUBLIC_API_URL}/api/login`
    content = content.replace(/"http:\/\/127\.0\.0\.1:8000([^"\n]*)"/g, '`${process.env.NEXT_PUBLIC_API_URL}$1`');
    
    // Replace backticks e.g. `http://127.0.0.1:8000/api/login` -> `${process.env.NEXT_PUBLIC_API_URL}/api/login`
    content = content.replace(/http:\/\/127\.0\.0\.1:8000/g, '${process.env.NEXT_PUBLIC_API_URL}');
    
    if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated: ' + file);
    }
});
