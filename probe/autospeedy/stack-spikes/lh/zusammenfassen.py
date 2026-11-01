# Median über 3 Lighthouse-Läufe: python3 zusammenfassen.py <ordner mit name-1.json …>
import json, statistics as s, sys
ordner = sys.argv[1] if len(sys.argv) > 1 else "."
for n in ["statisch", "next", "next3d"]:
    zeilen = []
    for i in (1, 2, 3):
        d = json.load(open(f"{ordner}/{n}-{i}.json")); a = d["audits"]
        js = sum(x.get("transferSize", 0) for x in a["network-requests"]["details"]["items"] if x.get("resourceType") == "Script")
        zeilen.append((d["categories"]["performance"]["score"] * 100, a["first-contentful-paint"]["numericValue"], a["largest-contentful-paint"]["numericValue"], a["total-blocking-time"]["numericValue"], a["cumulative-layout-shift"]["numericValue"], js, a["total-byte-weight"]["numericValue"]))
    m = [s.median(c) for c in zip(*zeilen)]
    print(n, "score %.0f FCP %.0f LCP %.0f TBT %.0f CLS %.3f JS %.1fKB total %.0fKB" % (m[0], m[1], m[2], m[3], m[4], m[5] / 1024, m[6] / 1024))
