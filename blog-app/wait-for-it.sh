#!/bin/sh

set -e

host="$1"
shift
cmd="$@"

until nc -z "$host" 8080; do
  >&2 echo "Server is unavailable - sleeping"
  sleep 5
done

>&2 echo "Server is up - executing command"
exec $cmd