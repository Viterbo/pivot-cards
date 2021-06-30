#!/bin/bash

HOME=$(pwd)
cd ..
PARENT=$(pwd)
cd $HOME

if [ "$1" == "prod" ]; then
    EXECUTE="npm run build"
else
    EXECUTE="npm run build-dev"
fi

echo "$EXECUTE"
eval $EXECUTE

if [ "$1" == "prod" ]; then    
    echo "--------------------"
    git add -A
    git commit -m 'save'
    git push
    amazon_server_console pivot
fi
