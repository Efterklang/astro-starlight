---
title: Binary Search
date: 2024-09-12
excerpt: 二分查找
categories: [Dev, Algorithm]
tags: [Algorithm]
cover: https://assets.vluv.space/cover/Dev/Algorithm/binary_search.webp
---

## 二分查找 binary search

二分查找是一种基于分治策略的高效搜索算法。它利用数据的有序性，每轮缩小一半搜索范围，直至找到目标元素或搜索区间为空为止。

- Pros: 时间效率高，无需额外空间开销。
- Cons: 仅适用于有序数组

```java
/* 二分查找（双闭区间） */
int binarySearch(int[] nums, int target) {
    // 初始化双闭区间 [0, n-1] ，即 i, j 分别指向数组首元素、尾元素
    int i = 0, j = nums.length - 1;
    // 循环，当搜索区间为空时跳出（当 i > j 时为空）
    while (i <= j) {
        int m = i + (j - i) / 2; // 计算中点索引 m
        if (nums[m] < target) // 此情况说明 target 在区间 [m+1, j] 中
            i = m + 1;
        else if (nums[m] > target) // 此情况说明 target 在区间 [i, m-1] 中
            j = m - 1;
        else // 找到目标元素，返回其索引
            return m;
    }
    // 未找到目标元素，返回 -1
    return -1;
}

/* 二分查找（左闭右开区间） */
int binarySearchLCRO(int[] nums, int target) {
    // 初始化左闭右开区间 [0, n) ，即 i, j 分别指向数组首元素、尾元素+1
    int i = 0, j = nums.length;
    // 循环，当搜索区间为空时跳出（当 i = j 时为空）
    while (i < j) {
        int m = i + (j - i) / 2; // 计算中点索引 m
        if (nums[m] < target) // 此情况说明 target 在区间 [m+1, j) 中
            i = m + 1;
        else if (nums[m] > target) // 此情况说明 target 在区间 [i, m) 中
            j = m;
        else // 找到目标元素，返回其索引
            return m;
    }
    // 未找到目标元素，返回 -1
    return -1;
}
```

```java
//寻找左侧边界的二分搜索
int left_bound(int[] nums, int target) {
    int left = 0;
    // 注意
    int right = nums.length;

    // 注意
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            right = mid;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else if (nums[mid] > target) {
            // 注意
            right = mid;
        }
    }
    return left;
}
//寻找右侧边界的二分搜索
int right_bound(int[] nums, int target) {
    int left = 0, right = nums.length;

    while (left < right) {
        int mid = left + (right - left) / 2;
        if (nums[mid] == target) {
            left = mid + 1;
        } else if (nums[mid] < target) {
            left = mid + 1;
        } else if (nums[mid] > target) {
            right = mid;
        }
    }
    // 注意
    return left - 1;
}
```

## Examples

### 34-在排序数组中查找元素的第一个和最后一个位置

```java
class Solution {
    public int[] searchRange(int[] nums, int target) {
        int leftIdx = binarySearch(nums, target, true);
        int rightIdx = binarySearch(nums, target, false);
        if (leftIdx <= rightIdx && rightIdx < nums.length && nums[leftIdx] == target && nums[rightIdx] == target) {
            return new int[] { leftIdx, rightIdx };
        }
        return new int[] { -1, -1 };
    }

    public int binarySearch(int[] nums, int target, boolean lower) {
        int left = 0, right = nums.length;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] < target) {
                left = mid + 1;
            } else if (nums[mid] > target) {
                right = mid;
            } else if (nums[mid] == target) {
                if (lower) {
                    right = mid;
                } else {
                    left = mid + 1;
                }
            }
        }
        return lower ? left : left - 1;
    }
}
```

### 704-二分查找

Time Complexity $O(log_n)$
Space Complexity $O(1)$

```java
class Solution {
    public int search(int[] nums, int target) {
        int left = 0, right = nums.length;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) {
                return mid;
            } else if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }
}
```

### 875-爱吃香蕉的珂珂

```java
class Solution {

    public int minEatingSpeed(int[] piles, int H) {
        int left = 1, right = 1;
        for (int pile : piles) {
            right = Math.max(right, pile);
        }

        while (left < right) {
            int mid = left + (right - left) / 2;

            if (estimatedHours(piles, mid) > H) {
                left = mid + 1;
            } else {
                right = mid;
            }
        }
        return left;
    }

    private int estimatedHours(int[] piles, int speed) {
        int hours = 0;
        for (int pile : piles) {
            hours += pile % speed == 0 ? pile / speed : pile / speed + 1;
        }
        return hours;
    }
}
```

### 1011-在 D 天内送达包裹的能力

> [!note] 1011,875 两题区别
> 1011：对任意 i，有 capacity > weight[i]，即一天至少运一箱货
> 875：对任意 i，有 pile[i] >= speed，即一小时最多吃一堆香蕉

```java
class Solution {
    public int shipWithinDays(int[] weights, int days) {
        int max = 0, sum = 0;
        for (int weight : weights) {
            max = Math.max(max, weight);
            sum += weight;
        }

        int left = max, right = sum;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (canDeliverWithinDays(weights, mid, days)) { // 对应mid[i] >= target
                right = mid;
            } else {
                left = mid + 1;
            }
        }
        return left;
    }

    boolean canDeliverWithinDays(int[] weight, int capacity, int days) {
        int currentWeightSum = 0, cntOfDay = 1;

        for (int w : weight) {
            currentWeightSum += w;
            if (currentWeightSum > capacity) {
                currentWeightSum = w;
                cntOfDay++;
            }
        }
        return cntOfDay <= days;
    }
}
```

## Ref

[binary_search](https://labuladong.online/algo/essential-technique/binary-search-framework)
