# hexo-include-markdown

This plugin for [Hexo](https://hexo.io/) can easily load another markdown files in markdown file .

## Document

[Hexoでmarkdownに外部マークダウンを読み込ませるプラグインを作った](https://tea3.github.io/p/17/hexo-include-markdown/)

## Requirements

This plugin supports node.js v4.3 or later. Also , I recommend Hexo v3.2 or later.

## Installation

``` bash
$ npm install hexo-include-markdown --save
```


## Usage

Please add `<!-- md your-markdown-path.md -->` in markdown file.

For example, edit the `source/_posts/hello-world.md` as follows.

```
---
title: Hello World
---

## include sample

Please load another markdown file with the following code.

<!-- md template.md -->

```

Next, please create a new markdown for the template. For example, create `source/_ template/template.md` as follows.

```
### include me ?

Here is the `template.md`'s content . This content is read from an external markdown file.

```


## option

Please set the following options. Please edit `_config.yml`.

```
include_markdown:
  dir: source/_template   # Base directory of template markdown
  verbose : true          # If you want to check the path of markdown that use <!-- md --> tag , please set the true.
```

## Referenced issue

- [hexo issue 1904](https://github.com/hexojs/hexo/issues/1904)
How do I split a post up into several smaller markdown files?

- [hexo issue 2376](https://github.com/hexojs/hexo/issues/2376)
How to make a home page out of multiple markdown files?

- [hexo issue 2582](https://github.com/hexojs/hexo/issues/2582)
Cache not updating on nested includes


## License

MIT

[Hexo]: http://hexo.io/