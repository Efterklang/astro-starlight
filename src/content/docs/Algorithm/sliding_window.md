---
title: Sliding Window
date: 2024-09-12
excerpt: 滑动窗口
categories: [Dev, Algorithm]
tags: [Algorithm]
cover: https://assets.vluv.space/cover/Dev/Algorithm/sliding_window.webp
---

## Examples

### 3-无重复字符的最长子串

Time Complexity $O(n)$. The left and right pointers do not decrease and each character will be added and removed at most once.

```java
import java.util.HashSet;
import java.util.Set;

class Solution {
    public int lengthOfLongestSubstring(String s) {
        Set<Character> substrWindow = new HashSet<Character>(); // set to store the characters in the current substring
        int res = 0;
        for (int left = 0, right = 0; right < s.length(); right++) {
            char ch = s.charAt(right);
            substrWindow.add(ch);
            res = Math.max(res, right - left + 1);
            while (substrWindow.contains(ch)) { // shrink left bound
                substrWindow.remove(s.charAt(left++));
            }
        }
        return res;
    }
}
```

### 76-最小覆盖子串

```java

class Solution {
    public String minWindow(String s, String t) {

        if (s.equals("") || t.equals("") || s.length() < t.length())
            return "";
        // ascii(A):65, ascii(z):122
        int[] need = new int[58]; // 记录 t 中每个字符的出现次数
        int[] have = new int[58]; // 目标字符串指定字符的出现次数，假设t为ABC，则have中统计滑动窗口中包含的A、B、C各自出现的次数

        for (int i = 0; i < t.length(); i++) {
            need[t.charAt(i) - 'A']++;
        }

        int left = 0, right = 0;
        int minWdwLen = s.length() + 1;
        int cntOfMatchedChar = 0, startIdxOfMinWdw = 0;

        while (right < s.length()) {
            int rightCharIndex = s.charAt(right) - 'A';

            if (need[rightCharIndex] == 0) {
                right++;
                continue;
            }

            if (have[rightCharIndex] < need[rightCharIndex]) {
                cntOfMatchedChar++;
            }

            have[rightCharIndex]++;
            right++;

            while (cntOfMatchedChar == t.length()) {
                if (right - left < minWdwLen) {
                    minWdwLen = right - left;
                    startIdxOfMinWdw = left;
                }

                // 窗口右移
                // have[leftCharIndex]--: 在滑动窗口中，leftCharIndex出现的次数减一
                // 如果leftCharIndex在need中，则left++的同时要cntOfMatchedChar--
                // 如果leftCharIndex不在need中，则left++
                int leftCharIndex = s.charAt(left) - 'A';

                if (have[leftCharIndex] == need[leftCharIndex] && need[leftCharIndex] != 0) {
                    cntOfMatchedChar--;
                }

                have[leftCharIndex]--;
                left++;
            }
        }

        if (minWdwLen == s.length() + 1) {
            return "";
        }

        return s.substring(startIdxOfMinWdw, startIdxOfMinWdw + minWdwLen);
    }
}
```

### 567-字符串的排列

```java
class Solution {
    public boolean checkInclusion(String s1, String s2) {
        int s1Len = s1.length(), s2Len = s2.length();
        int[] need = new int[26], have = new int[26];
        for (int i = 0; i < s1Len; i++) {
            need[s1.charAt(i) - 'a']++;
        }
        int left = 0, right = 0, cntOfMatchedChar = 0;
        while (right < s2Len) {
            int rightCharIndex = s2.charAt(right) - 'a';
            have[rightCharIndex]++;

            if (have[rightCharIndex] <= need[rightCharIndex]) {
                cntOfMatchedChar++;
            }

            while (cntOfMatchedChar == s1Len) {
                if (right - left == s1Len - 1)
                    return true;

                int leftCharIndex = s2.charAt(left) - 'a';
                have[leftCharIndex]--;

                if (have[leftCharIndex] < need[leftCharIndex]) {
                    cntOfMatchedChar--;
                }
                left++;
            }
            right++;
        }
        return false;
    }
}
```

### 2516-每种字符至少取 K 个

```java
class Solution {
    public int takeCharacters(String S, int k) {
        char[] s = S.toCharArray();
        int[] takenLettersCount = new int[3];
        for (char c : s) {
            takenLettersCount[c - 'a']++; // 一开始，把所有字母都取走
        }
        if (takenLettersCount[0] < k || takenLettersCount[1] < k || takenLettersCount[2] < k) {
            return -1; // 字母个数不足 k
        }

        int windowSize = 0; // 子串最大长度
        int left = 0, right = 0;

        for (char letter : s) {
            letter -= 'a';
            takenLettersCount[letter]--;
            while (takenLettersCount[letter] < k) {
                takenLettersCount[s[left] - 'a']++;
                left++;
            }
            windowSize = Math.max(windowSize, right - left + 1);
            right++;
        }

        return s.length - windowSize;
    }
}
```

## Ref

[滑动窗口解题套路框架](https://labuladong.online/algo/essential-technique/sliding-window-framework/)
