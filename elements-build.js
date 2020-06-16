// https://medium.com/@aks1357/getting-started-with-angular-elements-d13a967b03df

const fs = require('fs-extra');
const concat = require('concat');
(async function build() {
  // NOTE: Have changed angular.json file, 'outputPath' to 'dist' rather than
  // 'dist/<application-name>'. If you are using default angular.json then
  // for file paths below, add <application-name> in file path.
  // Example - './dist/my-medium/runtime.js', do the same for all.
  const files = [
    './dist/lodshow/polyfills-es2015.js',
    './dist/lodshow/runtime-es2015.js',
    './dist/lodshow/main-es2015.js'
  ];
  await fs.ensureDir('elements');
  await concat(files, 'elements/realia-list.js');
})();
