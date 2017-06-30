# hexo-include-markdown

This plugin for [Hexo](https://hexo.io/) can easily load markdown files in Markdown .

## Requirements

This plugin supported Hexo 3.2 or later and node.js v4.3 or later.

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

Load markdown with the following code.

<!-- md template.md -->

```

Next prepare the markdown for the template. For example, create a `source/_template/template.md`.

```
### include me ?

This content is read from an external markdown file.

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