const sass = require('sass');
const fs = require('node:fs');

const result = sass.compile('./src/stylesheet.scss', {
  style: 'expanded',
});

fs.writeFileSync('./build/stylesheet.css', result.css, 'utf-8');
