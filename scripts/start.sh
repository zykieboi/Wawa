#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="/workspaces/Broski"
COMPOSE_FILE="${PROJECT_DIR}/docker-compose.yml"

log() {
    printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"
}

main() {
    log "Starting services..."
    docker compose -f "${COMPOSE_FILE}" up -d

    log "Waiting for services to become ready..."
    sleep 10

    log "Restoring staff permissions..."
    "${PROJECT_DIR}/fix_perms.sh"

    log "All services are running."
}

main "$@"
