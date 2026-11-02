#!/usr/bin/env bash
# Startet ein leeres Postgres 16 in einem Wegwerf-Ordner, spielt Stub + Migration ein, prüft die Regeln.
set -euo pipefail
BIN=/usr/lib/postgresql/16/bin; D=$(mktemp -d); chown postgres "$D"
WEG() { runuser -u postgres -- $BIN/pg_ctl -D "$D/db" stop -m fast >/dev/null 2>&1 || true; rm -rf "$D"; }; trap WEG EXIT
runuser -u postgres -- $BIN/initdb -D "$D/db" -A trust >/dev/null
runuser -u postgres -- $BIN/pg_ctl -D "$D/db" -o "-p 55432 -k $D" -l "$D/log" start >/dev/null
H=$(dirname "$0"); P="psql -h $D -p 55432 -U postgres -v ON_ERROR_STOP=1 -q -t"
$P -f "$H/stub.sql"
$P -f "$H/../../supabase/migrations/20261102000000_autospeedy_cockpit.sql"
$P -f "$H/rauchprobe.sql" 2>&1 | sed 's/^psql:[^ ]* NOTICE:  /  /'
