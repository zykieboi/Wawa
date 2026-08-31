#!/usr/bin/env bash
set -euo pipefail

DB_CONTAINER="korone-dev-postgres-1"
REDIS_CONTAINER="korone-dev-redis-1"
SESSION_TTL_SECONDS=86400

log() {
    printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"
}

fetch_staff_ids() {
    docker exec "${DB_CONTAINER}" psql -U roblox -d economy -t -A -c \
        "SELECT DISTINCT user_id FROM user_permission;" 2>/dev/null || true
}

verify_session() {
    local user_id="$1"
    local session_id="$2"

    docker exec "${REDIS_CONTAINER}" redis-cli \
        SET "admin:2fa:v2:${user_id}:${session_id}" "1" EX "${SESSION_TTL_SECONDS}" > /dev/null
    log "Verified session ${session_id} for user_id=${user_id}"
}

main() {
    local staff_ids
    local redis_keys
    local session_user_id
    local session_id
    local staff_id

    log "Fetching staff user IDs from database..."
    staff_ids=$(fetch_staff_ids)

    if [[ -z "$staff_ids" ]]; then
        log "No staff users found."
        exit 0
    fi

    log "Staff user IDs: $(echo "$staff_ids" | tr '\n' ' ')"

    redis_keys=$(docker exec "${REDIS_CONTAINER}" redis-cli KEYS "sess:v1:*" 2>/dev/null || true)

    for key in $redis_keys; do
        session_user_id=$(docker exec "${REDIS_CONTAINER}" redis-cli GET "$key" 2>/dev/null \
            | grep -o '"userId":[0-9]*' | head -1 | cut -d: -f2)

        for staff_id in $staff_ids; do
            if [[ "$session_user_id" == "$staff_id" ]]; then
                session_id="${key#sess:v1:}"
                verify_session "$staff_id" "$session_id"
                break
            fi
        done
    done

    log "Done."
}

main "$@"
