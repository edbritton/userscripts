#!/usr/bin/env python3

import os
import re
from collections import Counter

SCRIPTS_DIR = "scripts"
README_PATH = "README.md"


def parse_metadata(filepath):
    with open(filepath) as f:
        content = f.read()

    name = None
    description = None

    us_match = re.search(r'// ==UserScript==', content)
    if us_match:
        name_m = re.search(r'// @name\s+(.+)', content)
        desc_m = re.search(r'// @description\s+(.+)', content)
        if name_m:
            name = name_m.group(1).strip()
        if desc_m:
            description = desc_m.group(1).strip()

    us_style = re.search(r'/\* ==UserStyle==', content)
    if us_style:
        name_m = re.search(r'@name\s+(.+)', content)
        desc_m = re.search(r'@description\s+(.+)', content)
        if name_m:
            name = name_m.group(1).strip()
        if desc_m:
            description = desc_m.group(1).strip()

    return name, description


def script_type(filename):
    if filename.endswith('.user.js'):
        return 'JS'
    elif filename.endswith('.user.css'):
        return 'CSS'
    return ''


def main():
    scripts = []
    for fname in os.listdir(SCRIPTS_DIR):
        if not (fname.endswith('.user.js') or fname.endswith('.user.css')):
            continue
        fpath = os.path.join(SCRIPTS_DIR, fname)
        name, description = parse_metadata(fpath)
        if name and description:
            scripts.append((name, description, fname))

    if not scripts:
        return

    scripts.sort(key=lambda x: x[2])

    name_counts = Counter(name for name, _, _ in scripts)
    name_occurrences = {}

    table_rows = []
    ref_links = []

    for name, description, fname in scripts:
        if name_counts[name] > 1:
            name_occurrences[name] = name_occurrences.get(name, 0) + 1
            occ = name_occurrences[name]
            if occ == 1:
                anchor = name
            else:
                base = fname.replace('.user.js', '').replace('.user.css', '')
                anchor = f"{name} ({base})"
        else:
            anchor = name

        stype = script_type(fname)
        table_rows.append(f"| [{anchor}] | {description} |  {stype}  |")
        ref_links.append(f"[{anchor}]: scripts/{fname}")

    table_header = "| Userscript                  | Description                                                  | Type |"
    table_sep = "|-----------------------------|--------------------------------------------------------------|:----:|"
    new_table = table_header + "\n" + table_sep + "\n" + "\n".join(table_rows)
    new_refs = "\n".join(ref_links)

    with open(README_PATH) as f:
        readme = f.read()

    table_idx = readme.find("| Userscript")
    if table_idx == -1:
        return

    before = readme[:table_idx]

    rest = readme[table_idx:]
    ref_matches = list(re.finditer(r'^\[[^\]]+\]: scripts/\S+$', rest, re.MULTILINE))

    if ref_matches:
        last_ref_end = table_idx + ref_matches[-1].end()
        after = readme[last_ref_end:]
    else:
        after = ""

    new_readme = before + new_table + "\n\n" + new_refs + after

    with open(README_PATH, 'w') as f:
        f.write(new_readme)


if __name__ == '__main__':
    main()
