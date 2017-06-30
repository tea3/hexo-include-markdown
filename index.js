'use strict';

const rp 		= require('./lib/replace.js')
const rf 		= require('./lib/orverwriteCache.js')
const PLUGIN_NM = 'hexo-include-markdown'

let option = {
	dir    : "source/_template" ,
	verbose: false
}

if( hexo.config.include_markdown){
	Object.assign( option , hexo.config.include_markdown )
}

hexo.extend.filter.register('after_init' , () => rf(hexo , option , PLUGIN_NM) )
hexo.extend.filter.register('before_post_render' , (data) => rp(data , hexo , option , PLUGIN_NM) )