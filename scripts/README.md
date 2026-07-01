# scripts/

Maintenance scripts. Run from the project root.

## `sync_footer.py`

The footer in `index.html` is the **canonical source of truth**. Run this script
whenever you edit the homepage footer to propagate the change to every other
`.html` file in the project (top-level pages and `industries/*.html`).

```sh
python3 scripts/sync_footer.py        # rewrites drifted footers in place
python3 scripts/sync_footer.py --check # exit 1 if any footer differs (CI gate)
```

### Workflow when changing the footer

1. Edit the `<footer>...</footer>` block inside `index.html` only.
2. Run `python3 scripts/sync_footer.py`.
3. Commit the resulting changes.

### Workflow when regenerating industry pages

If you re-run an industry-page generator script (e.g. a future
`build_industries.py`), run `python3 scripts/sync_footer.py` immediately after
to overwrite whatever footer the generator emitted with the canonical one.
