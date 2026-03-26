#!/usr/bin/env python3
"""Restore instruction blocks to untranslated state (en text copied to ro/ru/es)."""
import re
INPUT = '/data/data/com.termux/files/home/dev/mealspin/src/data/recipes_chunk08.ts'
with open(INPUT, 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
new_lines = []
fixed = 0

for line in lines:
    if '    instructions: { en: ' in line and "', ro: '" in line:
        try:
            en_marker = "en: '"
            en_start = line.index(en_marker) + len(en_marker)
            ro_sep = "', ro: '"
            en_end = line.index(ro_sep, en_start)
            en_text = line[en_start:en_end]

            ru_sep = "', ru: '"
            ro_start = en_end + len(ro_sep)
            ro_end = line.index(ru_sep, ro_start)
            ro_text = line[ro_start:ro_end]

            if ro_text != en_text:
                indent = line[:line.index('instructions')]
                new_line = indent + "instructions: { en: '" + en_text + "', ro: '" + en_text + "', ru: '" + en_text + "', es: '" + en_text + "' },"
                new_lines.append(new_line)
                fixed += 1
                continue
        except (ValueError, IndexError):
            pass
    new_lines.append(line)

content = '\n'.join(new_lines)
with open(INPUT, 'w', encoding='utf-8') as f:
    f.write(content)
print(f'Restored {fixed} instruction blocks')
