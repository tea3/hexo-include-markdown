'use strict';

const fs        = require('fs')
const path      = require('path')


module.exports = ( hexo , option , PLUGIN_NM ) =>
	readCacheFile(hexo , option , PLUGIN_NM)
  		.then(checkUpdateMarkdown)
  		.then(concatRefreshFlg)
  		.then(changeHashInCache)
  		.then(orverwriteCache)




let readCacheFile = ( hexo , option , PLUGIN_NM ) =>
	new Promise( (resolve , reject) => {
	  	let dbPath = path.join( process.env.PWD || process.cwd() , "db.json" )
	  	fs.readFile( dbPath , (err , fileData) => {
	  		if(err){
	  			reject( new Error(`[${PLUGIN_NM}] Could not open db.json .`) )
	  		}else{
	  			try{
		  			let db = (fileData && fileData != "" ? JSON.parse(fileData.toString("UTF-8")) : [])
		  			let taglist = []
		  			
		  			if(db && db.models && db.models.Post){
			  			for( let p of db.models.Post.entries() ){
			  				if( p[1].hexoIncludeMarkdown && p[1].hexoIncludeMarkdown.markdown){
				  				taglist.push({
				  					source   : p[1].source ,
				  					markdown : p[1].hexoIncludeMarkdown.markdown
				  				})
			  				}
			  			}
		  			}
		  			resolve({
		  				hexo       : hexo ,
		  				option     : option ,
		  				pluginName : PLUGIN_NM ,
		  				taglist    : taglist
		  			})
		  		}catch(e){
		  			reject( new Error(`[${PLUGIN_NM}] Could not parse db.json . Please delete db.json . \n${e}`) )
		  		}
	  		}
	  	})
  	})




let checkUpdateMarkdown = ( res ) => {

	let hexo      = res.hexo
	let option    = res.option
	let PLUGIN_NM = res.pluginName
	let taglist   = res.taglist
	
	return taglist.reduce( (promise, tag) =>
	    promise.then( (returnArr) =>
	      cum_parallel(hexo , option , PLUGIN_NM ,tag).then( (elm) => {
	        returnArr.push(elm)
	        return returnArr
	      })
	    )
  		, Promise.resolve([]))
}




let cum_parallel = (hexo , option , PLUGIN_NM , tag) =>
  	Promise.all( tag.markdown.map( (m) =>
    	new Promise( ( resolve , reject ) => {
        	fs.stat( m.path , (err , st) => {
        		if(err){
        			resolve({
        				hexo       : hexo ,
        				option     : option ,
        				pluginName : PLUGIN_NM ,
	        			taglist    :	{
	        					source  : tag.source ,
	        					markdown: m ,
	        					refresh : true
	        				}
        			})
        		}else{
        			let isRefresh = String(st.mtime) != String(m.mtime)
        			resolve({
        				hexo       : hexo ,
        				option     : option ,
        				pluginName : PLUGIN_NM ,
	        			taglist    :	{
	        					source  : tag.source ,
	        					markdown: m ,
	        					refresh : isRefresh
	        				}
        			})
        		}
        	})
      	})
  	))




let concatRefreshFlg = (res) =>
	new Promise( (resolve , reject) => {
		let postAndRereshStat = []
		let hexo
  		let option
  		let PLUGIN_NM
		
	  	for( let post of res ){
	  		let isRefresh = false
	  		let sourcePath = ""
	  		for( let tagsPost of post ){
				isRefresh  = isRefresh || tagsPost.taglist.refresh
				sourcePath = tagsPost.taglist.source
				hexo       = tagsPost.hexo
				option     = tagsPost.option
				PLUGIN_NM  = tagsPost.pluginName
	  		}
	  		postAndRereshStat.push({
	  			source     : sourcePath ,
	  			refresh    : isRefresh
	  		})
	  	}
	  	// console.log(postAndRereshStat)
	    resolve( [ postAndRereshStat , {
	    	hexo       : hexo ,
			option     : option ,
			pluginName : PLUGIN_NM
		} ])
	})




let changeHashInCache = (res) =>
	new Promise( (resolve , reject) => {
		let dbPath 		= path.join( process.env.PWD || process.cwd() , "db.json" )
		let postRS 		= res[0]
		let hexo   		= res[1].hexo
  		let option 		= res[1].option
  		let PLUGIN_NM 	= res[1].pluginName
  		
		if(postRS.length > 0){

		  	fs.readFile( dbPath , (err , fileData) => {
		  		if(err){
		  			reject( new Error(`[${PLUGIN_NM}] Could not open db.json .`) )
		  		}else{
		  			try{
			  			let db = JSON.parse(fileData.toString("UTF-8"))
			  			let isCacheChange = false

			  			for( let p of db.models.Cache.entries() ){
			  				for( let r of postRS ){
								if(r.refresh && p[1]._id == "source/" + r.source ){
									db.models.Cache[p[0]].hash = "0"
									isCacheChange = true
									break
								}
							}
						}
			  			resolve({
			  				db         : isCacheChange ? JSON.stringify(db) : null ,
			  				path       : dbPath ,
			  				hexo       : hexo ,
			  				option     : option ,
			  				pluginName : PLUGIN_NM
			  			})
			  		}catch(e){
			  			reject( new Error(`[${PLUGIN_NM}] Could not parse db.json . Please delete db.json . \n${e}`) )
			  		}
		  		}
		  	})
		}else{
			resolve({
  				db         : null ,
  				path       : dbPath ,
  				hexo       : hexo ,
  				option     : option ,
  				pluginName : PLUGIN_NM
  			})
		}
	})



let orverwriteCache = (res) => {

	let db     		= res.db
	let dbPath 		= res.path
	let hexo		= res.hexo
	let option		= res.option
	let PLUGIN_NM	= res.pluginName

	return new Promise( (resolve , reject) => {
		if(db){
			fs.writeFile( dbPath , db , (err) => {
				if(err){
					reject( new Error( `[${PLUGIN_NM}] Could not update hexo's cache file.` ))
				}else{
					resolve()
				}
			})
		}else{
			resolve()
		}
	})
}
