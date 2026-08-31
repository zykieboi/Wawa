#!/usr/bin/env bash
set -euo pipefail

DB_CONTAINER="korone-dev-postgres-1"
REDIS_CONTAINER="korone-dev-redis-1"
STAFF_USERS=(1 2)
PERMISSION_COUNT=87
SESSION_TTL_SECONDS=86400

log() {
    printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"
}

grant_all_permissions() {
    local user_id="$1"

    log "Granting permissions to user_id=${user_id}"
    docker exec "${DB_CONTAINER}" psql -U roblox -d economy -q -c "
        INSERT INTO user_permission (user_id, permission)
        SELECT ${user_id}, generate_series(0, ${PERMISSION_COUNT})
        ON CONFLICT (user_id, permission) DO NOTHING;
    "
}

verify_sessions() {
    local user_id="$1"
    local redis_keys
    local session_id
    local session_user_id

    redis_keys=$(docker exec "${REDIS_CONTAINER}" redis-cli KEYS "sess:v1:*" 2>/dev/null || true)

    for key in $redis_keys; do
        session_user_id=$(docker exec "${REDIS_CONTAINER}" redis-cli GET "$key" 2>/dev/null \
            | grep -o '"userId":[0-9]*' | head -1 | cut -d: -f2)

        if [[ "$session_user_id" == "$user_id" ]]; then
            session_id="${key#sess:v1:}"
            docker exec "${REDIS_CONTAINER}" redis-cli \
                SET "admin:2fa:v2:${user_id}:${session_id}" "1" EX "${SESSION_TTL_SECONDS}" > /dev/null
            log "Verified session ${session_id} for user_id=${user_id}"
        fi
    done
}

main() {
    local user_id

    for user_id in "${STAFF_USERS[@]}"; do
        grant_all_permissions "$user_id"
        verify_sessions "$user_id"
    done

    log "Done."
}

main "$@"
