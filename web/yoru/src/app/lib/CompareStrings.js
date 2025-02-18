export function CompareStrings(a, b) {
    // 将字符串转换为小写，以便不区分大小写
    a = a.toLowerCase();
    b = b.toLowerCase();

    const m = a.length, n = b.length;
    const matrix = [];

    // 初始化矩阵
    for (let i = 0; i <= m; i++) {
        matrix[i] = [i];
        for (let j = 1; j <= n; j++)
            matrix[i][j] = i ?
                Math.min(
                    matrix[i-1][j] + 1,
                    matrix[i][j-1] + 1,
                    matrix[i-1][j-1] + (a[i-1] !== b[j-1])
                ) : j;
    }

    const distance = matrix[m][n];
    const maxLen = Math.max(m, n);

    // 计算基本相似度
    let similarity = maxLen ? 1 - distance / maxLen : 1;

    // 增加连续匹配的优先权重
    let longestCommonSubsequence = 0;
    let currentSubsequence = 0;

    for (let i = 0, j = 0; i < m && j < n; ) {
        if (a[i] === b[j]) {
            currentSubsequence++;
            i++;
            j++;
        } else {
            longestCommonSubsequence = Math.max(longestCommonSubsequence, currentSubsequence);
            currentSubsequence = 0;
            if (matrix[i + 1][j] < matrix[i][j + 1]) {
                i++;
            } else {
                j++;
            }
        }
    }
    longestCommonSubsequence = Math.max(longestCommonSubsequence, currentSubsequence);

    // 根据最长公共子序列长度调整相似度
    similarity += longestCommonSubsequence / maxLen * 0.5;

    // 增加前端匹配的优先权重
    let prefixMatchLength = 0;
    for (let i = 0; i < Math.min(m, n); i++) {
        if (a[i] === b[i]) {
            prefixMatchLength++;
        } else {
            break;
        }
    }
    similarity += prefixMatchLength / maxLen * 0.5;

    // 确保相似度在0到1之间
    similarity = Math.min(similarity, 1);

    return similarity;
}
