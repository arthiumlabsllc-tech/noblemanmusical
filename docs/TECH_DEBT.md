# Tech Debt

## Known Issues

| ID | Area | Description | Severity | Impact | Plan | Owner |
|----|------|-------------|----------|--------|------|-------|
| TD-001 | Scaffold | Placeholder logo ships intentionally | Low | Visual | Client to provide final SVG | Client |
| TD-002 | Images | All product images are placeholders | Low | Visual | Client to provide real images | Client |

## Silent Failure Patterns

These are tooling bugs that can cause audits/scripts to report false results:

1. **git grep only searches tracked files** — Use filesystem scan for audits
2. **PowerShell [slug] is a wildcard in -Path** — Use -LiteralPath
3. **node script.mjs > out.txt** can create 0-byte file in some shells — Verify artifact exists and has content
4. **Get-NetTCPConnection can report empty** for a port netstat shows listening — Probe with HTTP
5. **Select-String -SimpleMatch can return false negatives** — Verify with raw count
6. **node -e with shell-escaped vars** can silently match no files — Print the denominator

**Rule:** Every audit must print "X of Y matched," never just "X"
**Rule:** Every scan that returns 0 matches must exit with error
