const {setDataFile, epubBookDir} = require('./setEpubData.js');
const {compressFunc,fileRename,removeDir} = require('./util/utils.js');
const {epubFileDir,bookDir} = require('./util/bookInfo.js');
const init = async () =>{
    await setDataFile();
    let flag = await compressFunc(epubBookDir,epubFileDir);
    if(flag){
        fileRename(epubFileDir);
        removeDir(bookDir)
        removeDir(epubBookDir)
    }
}
init();