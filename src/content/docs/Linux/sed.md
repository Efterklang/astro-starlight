---
title: Sed, Awk
date: 2025-10-25
tags: [Java]
---

## Sed

```shell
# 删除以cd开头的行
sed -i.bak '/^cd/d' ./history.txt
# 删除以mp4结尾的行
sed -i.bak '/mp4$/d' ./history.txt
# 删除空行
sed -i.bak '/^$/d' ./history.txt
```

```shell
# 修改
sed -i.bak 's/^第[0-9]\+章 .*/## &/' ./README.md
```
