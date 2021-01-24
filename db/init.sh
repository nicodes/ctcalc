#!/bin/sh

# (. ./.env && . ./db/init.sh)

export PGHOST=0.0.0.0 # TODO make dynamic
export PGPORT=$DB_PORT
export PGDATABASE=$DB_NAME
export PGUSER=$DB_ADMIN_USR
export PGPASSWORD=$DB_ADMIN_PWD

psql -d postgres -c "CREATE DATABASE $DB_NAME"

psql -f db/create_tables.sql

python db/ingest/ingest.py db/ingest/csv | psql

psql <<-EOSQL
    CREATE ROLE $DB_API_USR LOGIN PASSWORD '$DB_API_PWD';

    GRANT USAGE ON SCHEMA chloramine TO $DB_API_USR;
    GRANT USAGE ON SCHEMA chlorine_dioxide TO $DB_API_USR;
    GRANT USAGE ON SCHEMA free_chlorine TO $DB_API_USR;
    GRANT USAGE ON SCHEMA ozone TO $DB_API_USR;

    GRANT SELECT ON TABLE chloramine.giardia TO $DB_API_USR;
    GRANT SELECT ON TABLE chloramine.virus TO $DB_API_USR;
    GRANT SELECT ON TABLE chlorine_dioxide.giardia TO $DB_API_USR;
    GRANT SELECT ON TABLE chlorine_dioxide.virus TO $DB_API_USR;
    GRANT SELECT ON TABLE free_chlorine.giardia TO $DB_API_USR;
    GRANT SELECT ON TABLE free_chlorine.virus TO $DB_API_USR;
    GRANT SELECT ON TABLE ozone.giardia TO $DB_API_USR;
    GRANT SELECT ON TABLE ozone.virus TO $DB_API_USR;
EOSQL