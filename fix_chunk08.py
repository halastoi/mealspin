#!/usr/bin/env python3
"""Fix broken instruction lines in recipes_chunk08.ts by restoring proper quoting."""
import re

INPUT = '/data/data/com.termux/files/home/dev/mealspin/src/data/recipes_chunk08.ts'

with open(INPUT, 'r', encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
new_lines = []
fixed = 0

for line in lines:
    # Detect broken instruction lines: they have "instructions: { en: '" but
    # the ro/ru/es values are not properly quoted
    if '    instructions: { en: ' in line and "', ro: '" not in line and ', ro: ' in line:
        # Extract the en value properly
        en_marker = "en: '"
        en_start = line.index(en_marker) + len(en_marker)

        # Find the end of the en value - look for "', ro: " (the broken separator)
        # The en text ends with a proper closing quote before ", ro: "
        ro_sep_pos = line.index("', ro: ", en_start)
        en_text = line[en_start:ro_sep_pos]

        # Get the indentation
        indent = line[:line.index('instructions')]

        # Rebuild with en text for all languages (restoring to untranslated state)
        new_line = f"{indent}instructions: {{ en: '{en_text}', ro: '{en_text}', ru: '{en_text}', es: '{en_text}' }},"
        new_lines.append(new_line)
        fixed += 1
    else:
        new_lines.append(line)

content = '\n'.join(new_lines)

with open(INPUT, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Fixed {fixed} broken instruction lines")
