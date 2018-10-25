#/bin/bash

export DATABASE_URL=$(heroku config:get DATABASE_URL -a heyo-heyo-lil-mayo)
export THREAD_ID=100001935746541
heroku local