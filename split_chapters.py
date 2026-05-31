#!/usr/bin/env python3
"""将完整电子书拆分成独立章节文件"""

import re
from pathlib import Path

def split_chapters(input_file, output_dir):
    """拆分章节到独立文件"""
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 查找所有章节标题
    chapter_pattern = r'^### (第\d+章：.+)$'
    matches = list(re.finditer(chapter_pattern, content, re.MULTILINE))

    print(f"找到 {len(matches)} 个章节")

    for i, match in enumerate(matches):
        chapter_title = match.group(1)
        chapter_num = re.search(r'第(\d+)章', chapter_title).group(1)

        # 确定章节内容范围
        start = match.start()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(content)

        chapter_content = content[start:end].strip()

        # 生成文件名
        filename = f"chapter_{chapter_num.zfill(2)}.md"
        filepath = output_dir / filename

        # 添加frontmatter
        frontmatter = f"""---
title: {chapter_title}
---

"""

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(frontmatter + chapter_content)

        print(f"[OK] 创建 {filename}: {chapter_title}")

    print(f"\n完成！所有章节已保存到 {output_dir}")

if __name__ == '__main__':
    split_chapters('robot_ebook_complete.md', 'docs/chapters')
