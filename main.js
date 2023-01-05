// tvdb: https://www.thetvdb.com/?tab=seasonall&id=72514

const fs = require('fs');
const path = require('path');
const CSV = require('csv-string');
const chalk = require('chalk');
const argv = require('minimist')(process.argv.slice(2));

//const tvdbPath = path.resolve('./fix2.csv');
const tvdbPath = path.resolve('./Looney Tunes Golden Collection Episode List.csv');
const libraryPath = path.resolve(argv.library);

if (!argv.run) {
  console.log('DRY RUN START');
}

console.log(`Loading ${libraryPath}`);
console.log(`Loading ${tvdbPath}`);
console.log('');

const files = fs.readdirSync(libraryPath);
const content = fs.readFileSync(tvdbPath, 'utf8');
const tvdb = CSV.parse(content);

for (const episodeRow of tvdb) {

  var originalName = String(episodeRow[0] + '.mkv').trim();
  //console.log('original name is: ' + originalName);
  var newName = episodeRow[1];
  
  // match the file in the library path to the original file name in the CSV file
  const matchingFile = files.filter(function (file) {
    // //console.log(typeof file);

    // var areEqual = false;
    
    // if(file === originalName){
    //   areEqual = true;
    //   console.log('file is: ' + file);
    //   console.log('file length is :' + file.length);
    //   console.log('original name is: ' + originalName);
    //   console.log('file length is :' + originalName.length);
    //   console.log('eval of file comparison is: ' + areEqual);
    // }
    
    return file === originalName;
  });

  let matchingFilePath = false;
  // get the full path to the file for renaming
  if(Object.keys(matchingFile).length != 0 && matchingFile.constructor != Object)
  {
    //console.log(typeof matchingFile);
    //console.log('matchingFile is: ' + matchingFile);
    matchingFilePath = path.resolve(libraryPath + '/' + matchingFile);
  }
  
  if(matchingFilePath != false) {
    //console.log('matchingFilePath is: ' + matchingFilePath);
  }
  
  if (matchingFilePath != false) {
    //console.log('inside matchingFilePath');
    const pathSegments = matchingFilePath.split('/');
    const fileName = pathSegments[pathSegments.length - 1];
    const fileExt = path.extname(fileName);
    const newFilePath = matchingFilePath.replace(fileName, newName + '.mkv');

    console.log(`Renaming ${chalk.blue(matchingFilePath)} to ${chalk.green(newFilePath)}`);
    console.log('');

    if (argv.run === true) {
      fs.renameSync(matchingFilePath, newFilePath);
    } 
  }
}

if (!argv.run) {
  console.log('DRY RUN END');
}
