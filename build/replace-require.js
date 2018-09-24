const path = require('path');
const fs = require('fs');

const walkSync = (dir, filelist) => {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    } else {
      filelist.push(path.join(dir, file));
    }
  });
  return filelist;
};

const filelist = walkSync(path.join(__dirname, '../lib'));

for (let file of filelist) {
  fs.readFile(file, 'utf8', (err, data) => {
    if (err) {
      throw err;
    }
    let replaced = data.replace(/require\(("|')element-ui/g, 'require($1@dextop/element-ui');
    fs.writeFile(file, replaced, 'utf8', (err) => {
      if (err) throw err;
    });
  });
}
