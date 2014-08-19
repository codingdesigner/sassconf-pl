#!/bin/bash
echo "Started: `date`"
grunt build
echo "Done building: `date`"
rsync -vruhi --del public/ PATH-TO-SERVER
echo "Done rsyncing files: `date`"
grunt notify:done
