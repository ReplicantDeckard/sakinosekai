// WARNING: this will automatically overwrite the 'dist' directory!
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const {minify} = require('terser');
const postcss = require('postcss');
const cssnano = require('cssnano');

const srcJS = '_site/script.js';
const srcCSS = '_site/styles.css';

const dist = 'docs';
const src = '_site';

const distPath = path.resolve(dist);
const srcPath = path.resolve(src);

// NOTE: This current early iteration only minifies CSS and JS
// Copy and paste HTML and images BY HAND to DIST


// if (fs.existsSync(distPath)) {
//     console.log("Cleaning 'dist' directory...");

// }




let minifier = async (data) => {
    return await minify(data);
};

fs.readFile(path.resolve(srcJS), "utf8", (err, data) => {
    if (err) throw err;
    minifier(data).then(data => {
        fs.writeFile(path.resolve(distPath, 'script.js'), data.code, (err) => {
            if (err) throw err;
            console.log("Writing minified dist/script.js...");
        });
    });
});

fs.readFile(srcCSS, (err, css) => {
    if (err) throw err;
    console.log("Writing minified dist/styles.css...");
    postcss(cssnano)
    .process(css, { from: srcCSS, to: path.resolve(distPath, 'styles.css') })
    .then(result => {
      fs.writeFile(path.resolve(distPath, 'styles.css'), result.css, () => true)
    });
});