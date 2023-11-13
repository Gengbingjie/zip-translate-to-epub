const chapterId = 0;
const { bookName,date,author } = require('../util/bookInfo.js');
module.exports = {
    container : 
        `<?xml version="1.0"?>
        <container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
        <rootfiles>
            <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
        </rootfiles>
        </container>`,
    html : (chapterData) =>{
        return `<?xml version="1.0" encoding="utf-8" ?>
		<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
		<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="zh-CN">
		<head>
		<meta http-equiv="Content-Type" content="application/xhtml+xml; charset=utf-8" />
		<meta name="generator" content="EasyPub v1.43" />
		<title> 第${chapterData.num}章 ${chapterData.name} </title>
		<link rel="stylesheet" href="style.css" type="text/css"/>
		</head>
		<body>
		<div class="wrap">
		<h1> 第${chapterData.num}章 ${chapterData.name} <h1>
        ${chapterData.data.split('\n').map(data=>
            `<p>${data}</p>`
        ).join('')}
		</div>
		</body>
		</html>`
    },
    opf : (fileData)=>{
        return `<?xml version="1.0" encoding="utf-8" standalone="no"?>
        <package version="2.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid">
        <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
        <dc:identifier id="bookid">easypub-e16f2fd0</dc:identifier>
        <dc:title>${bookName}</dc:title>
        <dc:date>${date}</dc:date>
        <dc:rights>Created with EasyPub v1.43</dc:rights>
        <dc:language>zh-CN</dc:language>
        <meta name="cover" content="cover-image"/>
        </metadata>
        <manifest>
            <item id="ncxtoc" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
            <item id="css" href="style.css" media-type="text/css"/>
            <item id="cover-image" href="cover.jpg" media-type="image/jpeg"/>
            ${fileData.map(item=>
                `<item id="chapter${item.num}" href="chapter${item.num}.html" media-type="application/xhtml+xml"/>`
            ).join('\n')}
        </manifest>
        <spine toc="ncxtoc">
            ${fileData.map(item=>
                `<itemref idref="chapter${item.num}" linear="yes"/>`
            ).join('\n')}
        </spine>
        <guide>
        </guide>
        </package>`},
    ncx : (fileData)=>{
        return `<?xml version="1.0" encoding="utf-8" standalone="no"?>
        <!DOCTYPE ncx PUBLIC "-//NISO//DTD ncx 2005-1//EN" "http://www.daisy.org/z3986/2005/ncx-2005-1.dtd">
        <ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
        <head>
        <meta name="cover" content="cover"/>
        <meta name="dtb:uid" content="easypub-e16f2fd0" />
        <meta name="dtb:depth" content="1"/>
        <meta name="dtb:generator" content="EasyPub v1.43"/>
        <meta name="dtb:totalPageCount" content="0"/>
        <meta name="dtb:maxPageNumber" content="0"/>
        </head>
        <docTitle>
        <text>${bookName}</text>
        </docTitle>
        <docAuthor>
        <text>${author}</text>
        </docAuthor>
        <navMap>
            ${fileData.map(item=>
                `<navPoint id="chapter${item.num}" playOrder="${item.num}">
                    <navLabel><text> ${item.num}.${item.name} </text></navLabel>
                    <content src="chapter${item.num}.html"/>
                </navPoint>`
            ).join('\n')}
        </navMap></ncx>`},
    css : `
        body { 
            padding: 0;
            margin:0;
            orphans: 0;
            widows: 0;
        }
        
        .wrap{
            padding: 0 0px;
        }
        
        h1{
            font-size: 18px;
            line-height: 150%;
            text-align: center;
        }
        
        p{
            font-size: 15px;
            line-height: 150%;
            text-align: left;
        }`
}