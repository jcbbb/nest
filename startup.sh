#!/bin/sh

# echo "Waiting for postgres and redis startup"
# while ! nc -z postgres 5432; do sleep 3; done 
# while ! nc -z redis 6379; do sleep 3; done 

echo "Running migrations"
npm run migration:run

echo "Starting up application"
node dist/main.js
