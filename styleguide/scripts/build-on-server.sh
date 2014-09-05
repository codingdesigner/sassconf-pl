#!/bin/bash
#bundle install --deployment --path .bundle
#bundle exec compass compile
#php core/builder.php --generate

# Send a notice to the Phase2 chatroom in Flowdock
CONTENT="$(git log -1 | grep -i author)"
EMAIL="$(echo $CONTENT | sed 's,.*<,,' | tr -d '>')"
USER="$(echo $EMAIL | sed 's,@.*,,')"
curl --silent --data "from_address=$EMAIL&content=$CONTENT&source=Server&subject=Deploy Done&link=http://mac.elc.p2devcloud.com/&tags=#deploy,@${USER}" https://api.flowdock.com/v1/messages/team_inbox/8930473aedf107fc9b63a6d8ec6fda14
#original
#curl --silent --data "source=Beanstalk&from_address=%USER_EMAIL%&subject=Deploy Done&content=%COMMENT% - %REVISION%&link=http://elc.bobbibrown-patternlab.stealthwerk.com/public/&tags=#deploy,@%USER_NAME%&from_name=%USER_NAME%" https://api.flowdock.com/v1/messages/team_inbox/8930473aedf107fc9b63a6d8ec6fda14