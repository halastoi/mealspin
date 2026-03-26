#!/usr/bin/env python3
"""Main assembly: combine all translation parts and apply to the file."""

import re, sys, os
os.chdir(os.path.dirname(os.path.abspath(__file__)))

# Import all translation parts
exec(open('translate_chunk04_p1_data.py').read())
exec(open('translate_chunk04_p2.py').read())
exec(open('translate_chunk04_p3.py').read())
exec(open('translate_chunk04_p4.py').read())
exec(open('translate_chunk04_p5.py').read())
exec(open('translate_chunk04_p6.py').read())

# Merge all translations
all_translations = {}
all_translations.update(translations)
all_translations.update(translations_p2)
all_translations.update(translations_p3)
all_translations.update(translations_p4)
all_translations.update(translations_p5)
all_translations.update(translations_p6)

print(f"Total recipes with translations: {len(all_translations)}")

FILE = 'src/data/recipes_chunk04.ts'
with open(FILE, 'r', encoding='utf-8') as f:
    content = f.read()

def escape_for_ts(s):
    """Escape string for TypeScript single-quoted string."""
    return s.replace("\\", "\\\\").replace("'", "\\'")

# For each recipe, find and replace the ro, ru, es instruction values
replaced_count = 0

for recipe_id, trans in all_translations.items():
    # Find the recipe block by id
    id_pattern = f"id: '{recipe_id}'"
    id_pos = content.find(id_pattern)
    if id_pos == -1:
        print(f"WARNING: Recipe {recipe_id} not found!")
        continue

    # Find the instructions block after this id
    instr_pos = content.find("instructions: {", id_pos)
    if instr_pos == -1:
        print(f"WARNING: No instructions found for {recipe_id}")
        continue

    # Find the closing of the instructions object
    # We need to find the matching closing brace
    # The instructions block has { en: '...', ro: '...', ru: '...', es: '...' }
    # We need to find each language's value and replace it

    for lang in ['ro', 'ru', 'es']:
        if lang not in trans:
            continue

        new_value = escape_for_ts(trans[lang])

        # Find the lang key after instr_pos
        lang_search_start = instr_pos
        lang_pattern = f" {lang}: '"
        lang_pos = content.find(lang_pattern, lang_search_start)

        if lang_pos == -1:
            # Try without space
            lang_pattern = f"{lang}: '"
            lang_pos = content.find(lang_pattern, lang_search_start)

        if lang_pos == -1:
            print(f"WARNING: {lang} not found for recipe {recipe_id}")
            continue

        # Make sure this lang_pos is within reasonable distance (within this recipe's block)
        # Find the next recipe id to limit search
        next_id_pos = content.find("id: '", id_pos + len(id_pattern))
        if next_id_pos != -1 and lang_pos > next_id_pos:
            print(f"WARNING: {lang} for {recipe_id} found in wrong recipe block")
            continue

        # Find the start of the value (after the opening quote)
        value_start = content.find("'", lang_pos + len(lang) + 1) + 1

        # Find the end of the value - we need to find the closing quote
        # that's not escaped
        pos = value_start
        while pos < len(content):
            if content[pos] == "'" and content[pos-1] != '\\':
                break
            # Handle \\' (escaped backslash before quote)
            if content[pos] == "'" and pos >= 2 and content[pos-2:pos] == '\\\\':
                break
            pos += 1

        value_end = pos

        old_value = content[value_start:value_end]

        # Replace
        content = content[:value_start] + new_value + content[value_end:]
        replaced_count += 1

# Now fix names
for recipe_id, name_trans in name_fixes.items():
    id_pattern = f"id: '{recipe_id}'"
    id_pos = content.find(id_pattern)
    if id_pos == -1:
        continue

    # Find the name block
    name_pos = content.find("name: {", id_pos)
    if name_pos == -1:
        continue

    # Limit to reasonable range
    next_id_pos = content.find("id: '", id_pos + len(id_pattern))

    for lang in ['ro', 'ru', 'es']:
        if lang not in name_trans:
            continue

        new_name = escape_for_ts(name_trans[lang])

        lang_pattern = f" {lang}: '"
        lang_pos = content.find(lang_pattern, name_pos)

        if lang_pos == -1:
            lang_pattern = f"{lang}: '"
            lang_pos = content.find(lang_pattern, name_pos)

        if lang_pos == -1:
            continue

        # Make sure it's in the name block not the instructions block
        instr_pos = content.find("instructions:", id_pos)
        if instr_pos != -1 and lang_pos > instr_pos:
            # This is in instructions, not name - search before instructions
            lang_pos = content.find(lang_pattern, name_pos)
            if lang_pos == -1 or lang_pos > instr_pos:
                continue

        value_start = content.find("'", lang_pos + len(lang) + 1) + 1
        pos = value_start
        while pos < len(content):
            if content[pos] == "'" and content[pos-1] != '\\':
                break
            if content[pos] == "'" and pos >= 2 and content[pos-2:pos] == '\\\\':
                break
            pos += 1
        value_end = pos

        content = content[:value_start] + new_name + content[value_end:]

print(f"Replaced {replaced_count} instruction translations")

with open(FILE, 'w', encoding='utf-8') as f:
    f.write(content)

print("File written successfully!")
