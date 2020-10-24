#!/bin/bash
set -e

# ingest tables with data
gunzip < /app/dump.sql.gz | psql \
    -v ON_ERROR_STOP=1 \
    --username $POSTGRES_USER

# # create $API_USER as read-only
psql \
    -v ON_ERROR_STOP=1 \
    --username $POSTGRES_USER \
    --dbname ctcalc \
<<-EOSQL
    CREATE ROLE $API_USER LOGIN PASSWORD '$API_PASSWORD';

    GRANT USAGE ON SCHEMA chloramine TO $API_USER;
    GRANT USAGE ON SCHEMA chlorine_dioxide TO $API_USER;
    GRANT USAGE ON SCHEMA free_chlorine TO $API_USER;
    GRANT USAGE ON SCHEMA ozone TO $API_USER;
    
    GRANT SELECT ON TABLE chloramine.giardia TO $API_USER;
    GRANT SELECT ON TABLE chloramine.virus TO $API_USER;
    GRANT SELECT ON TABLE chlorine_dioxide.giardia TO $API_USER;
    GRANT SELECT ON TABLE chlorine_dioxide.virus TO $API_USER;
    GRANT SELECT ON TABLE free_chlorine.giardia TO $API_USER;
    GRANT SELECT ON TABLE free_chlorine.virus TO $API_USER;
    GRANT SELECT ON TABLE ozone.giardia TO $API_USER;
    GRANT SELECT ON TABLE ozone.virus TO $API_USER;
EOSQL
