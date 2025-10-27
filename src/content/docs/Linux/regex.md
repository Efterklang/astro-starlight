---
title: Regular Expression
date: 2024-03-10
excerpt: 正则表达式
tags:
  - Regex
---

## 语法

| 语法  | 描述                                                                            | 示例                                       |
| :---- | :------------------------------------------------------------------------------ | :----------------------------------------- |
| `.`   | 匹配除换行符外的任意单个字符。                                                  | `a.c` 匹配 "abc", "adc" 等。               |
| `*`   | 匹配前面的元素零次或多次。                                                      | `ab*c` 匹配 "ac", "abc", "abbc"。          |
| `+`   | 匹配前面的元素一次或多次。                                                      | `ab+c` 匹配 "abc", "abbc"，但不匹配 "ac"。 |
| `?`   | 匹配前面的元素零次或一次。                                                      | `colou?r` 匹配 "color" 和 "colour"。       |
| `.*?` | **非贪婪匹配**：匹配尽可能少的字符。这是非常有用的一个组合。                    | `a.*?c` 在 "abcdc" 中只会匹配 "abc"。      |
| `[]`  | **字符集**：匹配方括号内的任意一个字符。                                        | `[aeiou]` 匹配任何一个小写元音字母。       |
| `[^]` | **否定字符集**：匹配任何不在方括号内的字符。                                    | `[^0-9]` 匹配任何非数字字符。              |
| `()`  | **捕获组**：将括号内的表达式匹配到的内容捕获起来，以便在“替换”中引用。          | `(cat)` 匹配并捕获 "cat"。                 |
| `\`   | **转义字符**：用于匹配特殊字符的字面值，如 `.`、`*`、`(` 等。                   | `\.` 只会匹配英文句号 `.`。                |
| `$n`  | **反向引用**：在“替换”框中使用，`$1`、`$2` 分别引用第一个、第二个捕获组的内容。 | -                                          |

> [!NOTE] Extended Regex
>
> 在使用Basic Regular Expressions (BRE) 的工具（如 `grep`）时，某些元字符（如 `+`、`?`、`|`、`()`) 需要使用反斜杠进行转义才能正常工作。而在使用Extended Regular Expressions (ERE) 的工具（如 `egrep` 或 `grep -E`）时，这些元字符可以直接使用，无需转义。

### 预定义变量

数字： `\d` 匹配任何数字，等价于 `[0-9]`。
非数字： `\D` 匹配任何非数字字符，等价于 `[^0-9]`。
空白字符： `\s` 匹配任何空白字符，包括空格、制表符、换页符等，等价于 `[ \t\r\n\f]`。
非空白字符： `\S` 匹配任何非空白字符，等价于 `[^ \t\r\n\f]`。

## 命令行

### grep

`grep <arguments> <pattern> <file_name/file_pattern>`

#### Arguments

- `-o`: only matching，只输出匹配的部分，而不是整行。
- `-i`: ignore case，忽略大小写。
- `-v`: invert match，反向匹配，显示不包含匹配模式的行。
- `-n`: line number，显示匹配行的行号。
- `-c`: count，只输出匹配的行数
- `-l`: list files，只显示匹配的文件名。
- `-r`: recursive，递归搜索目录下的所有文件。
- `-E`: extended regex，启用扩展正则表达式（等价于 egrep）。

#### Examples

```shell
# 在 theme.conf 文件中查找包含 catppuccin 的行
grep catppuccin ./theme.conf
```

### Case 1: 将 Markdown语法的图片链接转换为 HTML 标签

From: `![alt text](path/to/image.png)]`
To: `<img src="path/to/image.png" alt="alt text">`

Find: `!\[([^\]]+)\]\(([^)]+)\)`
Replace: `<img src="$2" alt="$1">`
