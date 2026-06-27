# WIZL AI Scan QA Log

Updated: 2026-06-27

Purpose: test WIZL against 20-30 real package labels/photos before paid traffic. Use this as the launch QA sheet and keep user photos out of analytics, commits, and public docs.

## Pass Criteria

A scan passes when:

- The result is not a demo/fallback result.
- The result name is exact or a plausible close match.
- Confidence matches evidence quality: high for clear labels, medium for partial labels, low for ambiguous flower-only photos.
- Effects/flavors are educational and do not make medical promises.
- The save/check-in CTA works after the result.
- The result does not repeat an unrelated previous scan.

A scan fails when:

- It returns the old OG Kush-style fallback for an unrelated item.
- It ignores readable label text.
- It hallucinates lab certainty from a weak image.
- It sends or logs private image/text data to analytics.
- It blocks saving/check-in after the scan.

## Test Mix

Target 30 scans:

- 10 clear package labels with strain name visible.
- 5 partial/cropped labels.
- 5 flower or jar photos with no readable strain name.
- 5 typed descriptions from real labels.
- 5 edge cases: edible/vape package, Thai shop menu photo, blurry image, uncommon strain, non-cannabis decoy.

## Manual Log

| # | Input type | Real label / expected | Image quality | Result | Confidence | Pass? | Notes / fix needed |
|---:|---|---|---|---|---|---|---|
| 1 | clear label |  | high |  |  |  |  |
| 2 | clear label |  | high |  |  |  |  |
| 3 | clear label |  | high |  |  |  |  |
| 4 | clear label |  | high |  |  |  |  |
| 5 | clear label |  | high |  |  |  |  |
| 6 | clear label |  | high |  |  |  |  |
| 7 | clear label |  | high |  |  |  |  |
| 8 | clear label |  | high |  |  |  |  |
| 9 | clear label |  | high |  |  |  |  |
| 10 | clear label |  | high |  |  |  |  |
| 11 | partial label |  | medium |  |  |  |  |
| 12 | partial label |  | medium |  |  |  |  |
| 13 | partial label |  | medium |  |  |  |  |
| 14 | partial label |  | medium |  |  |  |  |
| 15 | partial label |  | medium |  |  |  |  |
| 16 | flower/jar | unknown | low/medium |  |  |  |  |
| 17 | flower/jar | unknown | low/medium |  |  |  |  |
| 18 | flower/jar | unknown | low/medium |  |  |  |  |
| 19 | flower/jar | unknown | low/medium |  |  |  |  |
| 20 | flower/jar | unknown | low/medium |  |  |  |  |
| 21 | typed label |  | text |  |  |  |  |
| 22 | typed label |  | text |  |  |  |  |
| 23 | typed label |  | text |  |  |  |  |
| 24 | typed label |  | text |  |  |  |  |
| 25 | typed label |  | text |  |  |  |  |
| 26 | edge case | vape / edible | medium |  |  |  |  |
| 27 | edge case | shop menu | medium |  |  |  |  |
| 28 | edge case | blurry label | low |  |  |  |  |
| 29 | edge case | uncommon strain | medium |  |  |  |  |
| 30 | edge case | non-cannabis decoy | medium |  |  |  |  |

## Summary

- Total tested:
- Pass:
- Needs copy/prompt tweak:
- Needs API logic fix:
- Needs UI fix:

Launch rule: paid traffic waits until at least 24/30 pass and no severe regression appears.
