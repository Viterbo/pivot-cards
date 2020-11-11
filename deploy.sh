#!/bin/bash

if [ "$1" == "prod" ]; then
    EXECUTE="ng build --base-href /pivot/ --prod"
else
    EXECUTE="ng build --base-href /pivot/ ";
fi

echo "deploying: $EXECUTE"
eval $EXECUTE

rm /var/www/pivot-cards/pivot -fr
cp /var/www/pivot-cards/src/.htaccess /var/www/pivot-cards/www/.htaccess

RENAME="mv /var/www/pivot-cards/www /var/www/pivot-cards/pivot"
echo "rename www -> pivot"
eval $RENAME

rm /var/www/landing-cards-and-tokens-prod/pivot -fr
COPYING="cp -r /var/www/pivot-cards/pivot /var/www/landing-cards-and-tokens-prod/pivot"
echo "$COPYING"
eval $COPYING


if [ "$1" == "prod" ]; then
    cd /var/www/landing-cards-and-tokens-prod/
    git add -A
    git commit -m 'save'
    git push
    amazon_server_console
fi
