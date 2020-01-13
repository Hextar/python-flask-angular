#!/bin/bash

name='hextar-db'

if ! docker ps --format '{{.Names}}' | egrep '^nginx$' &> /dev/null; then
    docker run --name $name \
    -p 5432:5432 \
    -e POSTGRES_DB=data-analysis-and-visualization-db \
    -e POSTGRES_PASSWORD=d4t4-4n4l1s1s-4nd-v1su4l1z4t10n \
    -d postgres
fi
