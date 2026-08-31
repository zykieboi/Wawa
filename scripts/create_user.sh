#!/usr/bin/env bash
set -euo pipefail

DB_CONTAINER="korone-dev-postgres-1"

usage() {
    echo "Usage: $0 <user_id> <username> <password>"
    exit 1
}

generate_password_hash() {
    local password="$1"

    python3 -c "
from argon2 import PasswordHasher
import sys

ph = PasswordHasher(memory_cost=32768, time_cost=4, parallelism=1)
print(ph.hash(sys.argv[1]))
" "$password"
}

insert_user() {
    local user_id="$1"
    local username="$2"
    local password_hash="$3"

    docker exec "${DB_CONTAINER}" psql -U roblox -d economy -q -c "
        INSERT INTO \"user\" (id, username, password) 
        VALUES (${user_id}, '${username}', '${password_hash}');
    "
}

insert_user_economy() {
    local user_id="$1"

    docker exec "${DB_CONTAINER}" psql -U roblox -d economy -q -c "
        INSERT INTO user_economy (user_id, balance_robux, balance_tickets)
        VALUES (${user_id}, 0, 0);
    "
}

insert_user_avatar() {
    local user_id="$1"

    docker exec "${DB_CONTAINER}" psql -U roblox -d economy -q -c "
        INSERT INTO user_avatar (
            user_id, head_color_id, torso_color_id, right_arm_color_id,
            left_arm_color_id, right_leg_color_id, left_leg_color_id
        ) VALUES (${user_id}, 1, 1, 1, 1, 1, 1);
    "
}

insert_user_settings() {
    local user_id="$1"

    docker exec "${DB_CONTAINER}" psql -U roblox -d economy -q -c "
        INSERT INTO user_settings (user_id) VALUES (${user_id});
    "
}

main() {
    if [[ $# -ne 3 ]]; then
        usage
    fi

    local user_id="$1"
    local username="$2"
    local password="$3"
    local password_hash

    password_hash=$(generate_password_hash "$password")
    insert_user "$user_id" "$username" "$password_hash"
    insert_user_economy "$user_id"
    insert_user_avatar "$user_id"
    insert_user_settings "$user_id"

    echo "Created user '${username}' (ID: ${user_id})"
}

main "$@"
