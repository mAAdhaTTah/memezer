#!/usr/bin/env bash

MEDIA_DIR="${MEDIA_DIR:-/data}"
MEMEZER_USER="${MEMEZER_USER:-memezer}"


# Set the memezer user UID & GID
if [[ -n "$PUID" && "$PUID" != 0 ]]; then
    usermod -u "$PUID" "$MEMEZER_USER" > /dev/null 2>&1
fi
if [[ -n "$PGID" && "$PGID" != 0 ]]; then
    groupmod -g "$PGID" "$MEMEZER_USER" > /dev/null 2>&1
fi

# Set the permissions of the data dir to match the memezer user
if [[ -d "$MEDIA_DIR" ]]; then
    # Check media directory permissions
    if [[ ! "$(stat -c %u $MEDIA_DIR)" = "$(id -u memezer)" ]]; then
        echo "Change in ownership detected, please be patient while we chown existing files"
        chown $MEMEZER_USER:$MEMEZER_USER -R "$MEDIA_DIR"
    fi
else
    # Create media directory
    mkdir -p "$MEDIA_DIR"
    chown -R $MEMEZER_USER:$MEMEZER_USER "$MEDIA_DIR"
fi
chown $MEMEZER_USER:$MEMEZER_USER "$MEDIA_DIR"

$(command -v $1 &> /dev/null)
# Drop permissions to run commands as the memezer user
if [[ $? == 0 ]]; then
    # arg 1 is a binary, execute it verbatim
    exec gosu "$MEMEZER_USER" bash -c "$*"
else
    # no command given, assume args were meant to be passed to memezer cmd
    exec gosu "$MEMEZER_USER" bash -c "typer memezer.app run $*"
fi
