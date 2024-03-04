#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE DATABASE todoapp;

    \c todoapp;

    CREATE TABLE todos (
        id VARCHAR(255) PRIMARY KEY,
        user_email VARCHAR(255),
        title VARCHAR(30),
        progress INT,
        date VARCHAR(300)
    );

    CREATE TABLE users (
        email VARCHAR(255) PRIMARY KEY,
        hashed_password VARCHAR(255)
    );
EOSQL