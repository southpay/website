#!/usr/bin/env python3
"""Inject Google Analytics + Amplitude into every HTML page's <head>.

Idempotent — re-runs skip files that already carry the snippets. Run any time
the analytics keys change; the markers `GA_BEGIN` / `AMPLITUDE_BEGIN` make it
easy to find and replace.

  python3 scripts/inject_analytics.py        # inject / refresh
  python3 scripts/inject_analytics.py --check # exit 1 if any page is missing
"""
from pathlib import Path
import re
import sys

ROOT = Path(__file__).resolve().parent.parent

GA_TAG_ID = "G-G1YWDRHW8T"
AMPLITUDE_KEY = "51e878630d71dd604ea12b394f5b1e6a"

GA_BLOCK = f"""<!-- GA_BEGIN -->
<script async src="https://www.googletagmanager.com/gtag/js?id={GA_TAG_ID}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){{dataLayer.push(arguments);}}
  gtag('js', new Date());
  gtag('config', '{GA_TAG_ID}');
</script>
<!-- GA_END -->"""

AMPLITUDE_BLOCK = f"""<!-- AMPLITUDE_BEGIN -->
<script src="https://cdn.eu.amplitude.com/script/{AMPLITUDE_KEY}.js"></script>
<script>
  window.amplitude.add(window.sessionReplay.plugin({{sampleRate: 1}}));
  window.amplitude.init('{AMPLITUDE_KEY}', {{"fetchRemoteConfig":true,"autocapture":{{"attribution":true,"fileDownloads":true,"formInteractions":true,"pageViews":true,"sessions":true,"elementInteractions":true,"networkTracking":true,"webVitals":true,"frustrationInteractions":true}}}});
</script>
<!-- AMPLITUDE_END -->"""

GA_RE = re.compile(r"<!-- GA_BEGIN -->.*?<!-- GA_END -->", re.DOTALL)
AMPLITUDE_RE = re.compile(r"<!-- AMPLITUDE_BEGIN -->.*?<!-- AMPLITUDE_END -->", re.DOTALL)


def find_html_files():
    files = list(ROOT.glob("*.html"))
    files.extend((ROOT / "industries").glob("*.html"))
    return files


def inject(html):
    """Return (new_html, changed_bool). Inserts/refreshes both blocks just
    before </head>. If the blocks already exist, replaces them in place."""
    new_html = html
    if GA_RE.search(new_html):
        new_html = GA_RE.sub(GA_BLOCK.replace("\\", "\\\\"), new_html)
    else:
        new_html = new_html.replace("</head>", GA_BLOCK + "\n</head>", 1)

    if AMPLITUDE_RE.search(new_html):
        new_html = AMPLITUDE_RE.sub(AMPLITUDE_BLOCK.replace("\\", "\\\\"), new_html)
    else:
        new_html = new_html.replace("</head>", AMPLITUDE_BLOCK + "\n</head>", 1)

    return new_html, new_html != html


def main():
    check_only = "--check" in sys.argv
    missing = []
    changed = 0
    for fp in find_html_files():
        html = fp.read_text()
        if check_only:
            if "GA_BEGIN" not in html or "AMPLITUDE_BEGIN" not in html:
                missing.append(fp.relative_to(ROOT))
            continue
        new_html, did = inject(html)
        if did:
            fp.write_text(new_html)
            print(f"injected {fp.relative_to(ROOT)}")
            changed += 1
        else:
            pass  # already up to date

    if check_only:
        if missing:
            print(f"{len(missing)} file(s) missing analytics:", file=sys.stderr)
            for m in missing:
                print(f"  {m}", file=sys.stderr)
            return 1
        print("All pages carry analytics.")
        return 0

    if changed == 0:
        print("All pages already up to date.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
