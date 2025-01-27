const fs = require("fs");
const path = require("path");

// 获取命令行参数
const title = process.argv[2];

// 检查是否提供了参数
if (!title) {
  console.error("❌ Error: Please provide a title as an argument.");
  process.exit(1);
}

// 获取当前日期 (YYYY-MM-DD 格式)
const now = new Date();
const formattedDate = now.toISOString().split("T")[0]; // 只取日期部分

// 构造文件路径：posts 文件夹下
const postsDir = path.join(process.cwd(), "posts");
const fileName = `${formattedDate}-${title}.md`;
const filePath = path.join(postsDir, fileName);

// 确保 posts 文件夹存在，如果不存在则创建
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

// 检查文件是否已存在
if (fs.existsSync(filePath)) {
  console.error(`❌ Error: File already exists: ${fileName}`);
  process.exit(1);
}

// 默认内容模板
const fileContent = `---
title: '${title}'
tags:
  - React
layout: post
date: '${formattedDate}'
description: '${title}'
---

# ${title}

`;

// 创建 Markdown 文件并写入内容
fs.writeFileSync(filePath, fileContent, "utf8");

console.log(`✅ Markdown file created: ${filePath}`);
