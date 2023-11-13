const { mkdirSync,writeFileSync,cpSync } = require('fs');
const { isArray,epubFileObj,existsFlag } = require('./util/utils.js');
const { html } = require('./json/fileContent.js');
const { bookName } = require('./util/bookInfo.js');
const getZipData = require('./getData.js')
const dirName = 'epub';
const epubBookDir = `./${dirName}/${bookName}/`;
const createDir = (path) =>{
    if (!existsFlag(path)) {
        mkdirSync(path, { recursive: true });
    }
};
const createStaticFile = (obj) => {
    let {path, name, content} = obj;
    let filePath = `${path}${name}`;
    if (!existsFlag(filePath)) {
        writeFileSync(filePath,content)
    };
}
const createChapterFile = (data,path) =>{
    if(data && data.length > 0){
        data.forEach(item=>{
            createStaticFile({
                path : path,
                name : `chapter${item.num}.html`,
                content : html(item)
            })
        })
    }
}
// createDir(epubBookDir);

const setDataFile = async () =>{
    let {fileData,coverSrc = ''} = await getZipData();
    for(let key in epubFileObj){
        let obj = epubFileObj[key];
        if(isArray(obj)){
            createDir(`${epubBookDir}${key}`);
            obj.forEach(item=>{
                for( let k in item){
                    if(item[k] == 1){
                        let fileName = Object.keys(item)[0]
                        let data = item[fileName];
                        createStaticFile({
                            path : `${epubBookDir}${key}/`,
                            name : fileName,
                            content : data
                        });
                    }else if(item[k] == 2){
                        if(!fileData) return;
                        if(Object.keys(item)[0] !== 'html'){
                            let fileName = Object.keys(item)[0]
                            let func = item[fileName];
                            item[fileName] = func(fileData);
                            createStaticFile({
                                path : `${epubBookDir}${key}/`,
                                name : fileName,
                                content : item[fileName]
                            });
                        }else{
                            createChapterFile(fileData,`${epubBookDir}${key}/`);
                        };
                    }else if(item[k] == 3){
                        if(coverSrc){
                            let coverName = Object.keys(item)[0];
                            let dest = `${epubBookDir}${key}/${coverName}`
                            cpSync(coverSrc,dest)
                        }
                    }
                }
            })
        }else{
            createStaticFile({
                path : epubBookDir,
                name : key,
                content : obj
            });
        }
    };
    return true
}
exports.epubBookDir = epubBookDir;
exports.setDataFile = setDataFile;

