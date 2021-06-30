#!/bin/bash

HOME=$(pwd)
cd ..
PARENT=$(pwd)
cd $HOME

if [ "$1" == "prod" ]; then
    EXECUTE="ng build --base-href /pivot/ --prod"
else
    EXECUTE="ng build --base-href /pivot/ ";
fi

echo "$EXECUTE"
eval $EXECUTE

rm $HOME/pivot -fr
cp $HOME/src/.htaccess $HOME/www/.htaccess
mv $HOME/www $HOME/pivot

if [ ! -d "$PARENT/landing-cards-and-tokens-prod" ];
    echo "Clonning landing-cards-and-tokens:"
    then git clone https://github.com/vapaee/landing-cards-and-tokens.git $PARENT/landing-cards-and-tokens-prod;
fi;
cd $PARENT/landing-cards-and-tokens-prod
echo "git checkout prod"
git checkout prod
echo "git pull"
git pull
echo "rm pivot -fr"
rm pivot -fr


COPYING="cp -r $HOME/pivot $PARENT/landing-cards-and-tokens-prod/pivot"
echo "$COPYING"
eval $COPYING

if [ "$1" == "prod" ]; then
    cd $PARENT/landing-cards-and-tokens-prod
    echo $PWD
    echo "--------------------"
    git add -A
    git commit -m 'save'
    git push
    amazon_server_console
fi
