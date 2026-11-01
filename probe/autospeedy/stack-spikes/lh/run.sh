#!/bin/bash
# usage: run.sh name url
for i in 1 2 3; do
  node /tmp/claude-0/-home-user-design-uni/f49574a3-8c21-5602-84fa-63f12ebb08c9/scratchpad/spike/tools/node_modules/lighthouse/cli/index.js "$2" \
    --chrome-path=/opt/pw-browsers/chromium-1243/chrome-linux64/chrome \
    --chrome-flags="--headless=new --no-sandbox --disable-gpu" \
    --only-categories=performance --form-factor=mobile --quiet \
    --output=json --output-path=/tmp/claude-0/-home-user-design-uni/f49574a3-8c21-5602-84fa-63f12ebb08c9/scratchpad/spike/lh/$1-$i.json >/dev/null 2>&1
done
