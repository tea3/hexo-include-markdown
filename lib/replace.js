'use strict';

const fs        = require('fs')
const path      = require('path')



module.exports = (data , hexo , option , PLUGIN_NM) => {

	let tags = data.content.match(/\<\!\-\-\s+?md\s+?.+?\s+?\-\-\>/g)

	if(tags){

		return tags.reduce( (promise, value) =>
		    promise.then( (editedArray) =>
		    	parallel( [ value , option , data.source , PLUGIN_NM ] ).then( (editedElement) => {
		        	editedArray.push(editedElement)
		        	return editedArray
		      	})
		    )
		  	, Promise.resolve([]))
		.then( (res) => {
		  	return new Promise( (resolve , reject) => {
		  		if(res && res.length > 0 ){
		  			for( let r of res){
		  				data.content = data.content.replace( r[0] , r[1] )

		  				// save cache data
		  				if(!data.hexoIncludeMarkdown){
		  					data.hexoIncludeMarkdown = { markdown: [r[2]] }
		  				}else{
		  					data.hexoIncludeMarkdown.markdown.push(r[2])
		  				}
		  			}
		  		}
		    	resolve(data)
		  	})
		})
	}else{
		// clear cache data
		data.hexoIncludeMarkdown = { markdown : [] }
		return Promise.resolve(data)
	}
}


let parallel = ( res ) =>
    new Promise( ( resolve , reject ) => {

		let m      	= res[0]
		let option 	= res[1]
		let source  = res[2]
		let PLUGIN_NM = res[3]
        let tags 	= m.match(/\<\!\-\-\s+?md\s+?(.+?)\s+?\-\-\>/)

		if( tags && tags.length >= 2 ){
			
			let mdPath = ""
			if(tags[1].match(/^(\"|\')/) && tags[1].match(/(\"|\')$/) ){
				mdPath = tags[1].replace(/^(\"|\')/,"").replace(/(\"|\')$/,"")
			}else{
				let mdPathArr = tags[1].split(" ")
				mdPath = mdPathArr[ Math.floor( Math.random()* mdPathArr.length ) ]
			}
			
			let filePath = path.join( process.env.PWD || process.cwd() , option.dir , mdPath )
			fs.readFile( filePath , (err , fileData) => {
				if(err){
					reject(new Error( `[${PLUGIN_NM}] Could not open file. \n -> (file): ${filePath}\n    (message): ${err}` ))
				}else{
					
					if(option.verbose){
						console.log(`[${PLUGIN_NM}] This tag will be converted normally. \n -> (file): ${source}\n    (data): ${m}`)
					}
					
					fs.stat( filePath , (err , st) => {
						resolve([m , fileData , { path: filePath , mtime: String(st.mtime) } ] )
					})
				}
			})
		}else{
			reject( new Error(`[${PLUGIN_NM}] The format of the tag is incorrect. \n -> (file): ${source}\n    (data): ${m}`) )
		}
    })