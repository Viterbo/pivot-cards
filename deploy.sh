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
    echo git add -A
    echo git commit -m 'save'
    echo git push
    echo amazon_server_console pivot
fi
