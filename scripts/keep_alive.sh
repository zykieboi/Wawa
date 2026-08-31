#!/usr/bin/env bash
set -euo pipefail

INTERVAL_SECONDS=300
LOG_FILE="/tmp/keep_alive.log"

log() {
    printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*" | tee -a "$LOG_FILE"
}

main() {
    log "Keep-alive started. Interval: ${INTERVAL_SECONDS}s"

    while true; do
        # Ping localhost to generate activity
        curl -s http://localhost:3000 > /dev/null 2>&1 || true
        log "Heartbeat sent"

        sleep "${INTERVAL_SECONDS}"
    done
}

main "$@"
