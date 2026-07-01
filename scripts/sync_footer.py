#!/usr/bin/env python3
"""Sync the footer block on every page to match the canonical homepage footer.

Source of truth: <footer>...</footer> block inside /index.html.
Run this script whenever the homepage footer changes; it will rewrite every
other HTML file's footer in place. Idempotent.

  python3 scripts/sync_footer.py        # run sync
  python3 scripts/sync_footer.py --check # exit 1 if any footer differs (CI gate)
"""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent.parent
CANONICAL = ROOT / "index.html"

FOOTER_RE = re.compile(r"<footer>.*?</footer>", re.DOTALL)


def extract_footer(text):
    m = FOOTER_RE.search(text)
    return m.group(0) if m else None


def find_html_files():
    files = list(ROOT.glob("*.html"))
    files.extend(ROOT.glob("industries/*.html"))
    return [f for f in files if f != CANONICAL]


def main():
    check_only = "--check" in sys.argv

    canonical_html = CANONICAL.read_text()
    canonical_footer = extract_footer(canonical_html)
    if canonical_footer is None:
        print(f"ERROR: no <footer> block found in {CANONICAL}", file=sys.stderr)
        return 2

    drifted = []
    for fp in find_html_files():
        content = fp.read_text()
        current = extract_footer(content)
        rel = fp.relative_to(ROOT)
        if current is None:
            print(f"  skip   {rel} (no footer block)")
            continue
        if current == canonical_footer:
            continue
        drifted.append(rel)
        if check_only:
            print(f"  drift  {rel}")
        else:
            new = FOOTER_RE.sub(lambda _: canonical_footer, content, count=1)
            fp.write_text(new)
            print(f"  sync   {rel}")

    if check_only and drifted:
        print(f"\n{len(drifted)} file(s) drift from canonical footer", file=sys.stderr)
        return 1
    if not drifted:
        print("All footers already match canonical.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
