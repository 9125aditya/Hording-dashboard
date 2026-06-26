const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('src', (filepath) => {
  if (filepath.endsWith('.tsx') || filepath.endsWith('.ts')) {
    let content = fs.readFileSync(filepath, 'utf8');
    let changed = false;
    
    const replacements = [
      { from: /from [\'\"]@\/backend\/actions[\'\"]/g, to: 'from \"@/backend/actions/actions\"' },
      { from: /from [\'\"]\.\/supabase\/server[\'\"]/g, to: 'from \"@/backend/db/server\"' },
      { from: /from [\'\"]\.\/supabase\/client[\'\"]/g, to: 'from \"@/backend/db/client\"' },
      { from: /from [\'\"]\.\.\/supabase\/server[\'\"]/g, to: 'from \"@/backend/db/server\"' },
      { from: /from [\'\"]\.\.\/supabase\/client[\'\"]/g, to: 'from \"@/backend/db/client\"' }
    ];
    
    replacements.forEach(r => {
      if (content.match(r.from)) {
        content = content.replace(r.from, r.to);
        changed = true;
      }
    });

    if (changed) {
      fs.writeFileSync(filepath, content);
      console.log('Fixed ' + filepath);
    }
  }
});
