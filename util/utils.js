const { container,css,opf,ncx } = require('../json/fileContent.js');
const compressing = require('compressing');
const {bookName} = require('./bookInfo.js');
const {renameSync,existsSync,rmSync} = require('fs');
module.exports = {
    getChapterInfo(str){
        let arr = str.split(' ');
        let num = arr[0].match(/\d+/)[0];
        let name = arr[1].replace('.txt','');
        // let name = arr[1].slice(0,-4);
        return {chapterNum : num,chapterName : name}
    },
    isArray : (key) => {return Array.isArray(key)},
    existsFlag : (path) =>{
        if(existsSync(path)){
            return true;
        }else{
            return false;
        }
    },
    epubFileObj :  {                   //type : 1 静态文件  2:动态文件
        'META-INF' : [                      //存放表述整个文档的元数据
            {'container.xml' : container,type : 1} //告诉阅读器，电子书的根文件的路径和打开格式
        ],
        'mimetype' : 'application/epub+zip',
        'OEBPS' : [                         //存放OPF文档、CSS文档、NCX文档
            {'html' : '',type : 2},     //存储具体章节内容
            {'content.opf' : opf,type : 2},  //一个xml文件，根元素为<package>xmlns="http://www.idpf.org/2007/opf" version="2.0" unique-identifier="uuid_id">
            {'cover.jpg' : '',type : 3},    //书封面图片
            {'style.css' : css,type : 1},   //html文件引入的样式
            {'toc.ncx' : ncx,type : 2}       //制作电子书的目录，最主要的节点是navMap,navMap节点是由许多navPoint节点组成
        ]
    },
    compressFunc : (path,target) =>{
        if(!path) return;
        return new Promise((resolve,reject)=>{
            compressing.zip.compressDir(path, `${target}${bookName}.zip`,{ignoreBase: true}).then(res=>{
                resolve(true);
            }).catch(err=>{
                reject(false);
            });
        })
    },
    fileRename : (path,originFormat='zip',targetFormat='epub') =>{
        let oldPath = `${path}${bookName}.${originFormat}`;
        let newPath = `${path}${bookName}.${targetFormat}`;
        renameSync(oldPath,newPath);
    },
    removeDir : (path) =>{
        rmSync(path,{recursive:true})
    }
}