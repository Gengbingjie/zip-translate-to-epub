const {access,constants,readdirSync,readFile } = require('fs');
const compressing = require('compressing');
const { getChapterInfo,existsFlag } = require('./util/utils.js');
const { baseUrl,bookDir } = require('./util/bookInfo.js');
const getZipData = async ()=>{
    const uncompressFlag = existsFlag(bookDir);
    if(!uncompressFlag){
        await uncompressZip()
    }
    let arr = await readFileDir();
    return arr;
}
const uncompressZip = ()=>{
    return new Promise((resolve,rejects)=>{
        compressing.zip.uncompress(`${bookDir}.zip`, baseUrl).then(res=>{
            resolve(true)
        }).catch(e=>{
            rejects(e)
        })
    })
    
}
const readFilelist = () =>{
    return readdirSync(bookDir);
}
const readFileDir =  async () =>{
    let fileList = readFilelist(),
        fileData = [],
        coverSrc;
    for(let i = 0; i < fileList.length; i++){
        if(fileList[i].endsWith('.txt')){
            const obj = await readFileFunc(`${bookDir}/${fileList[i]}`,fileList[i])
            fileData.push(obj)
        }else if(fileList[i].endsWith('.jpg')){
            coverSrc = `${bookDir}/${fileList[i]}`
        }
    };
    return {fileData,coverSrc};
}
const readFileFunc = (path,name) =>{
    return new Promise((resolve,rejects)=>{
        readFile(path,'utf8',(e,data)=>{
            if(e){
                rejects(e)
            }else{
                let obj = getChapterInfo(name);
                resolve({
                    num : obj.chapterNum,
                    name : obj.chapterName,
                    data : data
                })
            }
        })
    })
}
module.exports = getZipData;