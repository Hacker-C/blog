## My Blog

A clean,fast,light blog theme based on Vitepress.

- Link: https://blog.mphy.top
- Theme based on: https://github.com/airene/vitepress-blog-pure

## Feature

- 修改了原主题的目录展示效果

## Tip

项目运行过程中每一页的文章会生成一些文件，例如 page_1.md、page_2.md 等等，可以在根目录下配置 `.vscode/settings.json`，隐藏该文件。另外，此类已经添加在了 .gitignore 中。

```json
{
  "files.exclude": {
    "page_*.md": true
  }
}
```