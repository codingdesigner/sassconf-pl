#!/bin/bash
echo "Started: `date`"
grunt build
echo "Done building: `date`"
rsync -vruhi --del public/ elc.p2devcloud.com:/opt/development/mac/public/
echo "Done rsyncing files: `date`"
grunt notify:done
# Send a notice to the Phase2 chatroom in Flowdock
#CONTENT="$(git log --pretty=format:"- (%an) %s%n%b" --since="$(git show -s --format=%ad `git rev-list --tags --max-count=1`)")"
CONTENT="$(git log -1 | grep -i author)"
EMAIL="$(echo $CONTENT | sed 's,.*<,,' | tr -d '>')"
USER="$(echo $EMAIL | sed 's,@.*,,')"
curl --silent --data "from_address=$EMAIL&content=$CONTENT&source=Server&subject=Deploy Done&link=http://mac.elc.p2devcloud.com/&tags=#deploy,@${USER}" https://api.flowdock.com/v1/messages/team_inbox/8930473aedf107fc9b63a6d8ec6fda14
