#!/bin/sh
set -e

/root/config-srv &
/root/agent-api &
/root/admin-api &
/root/micro --cors-allowed-headers="Content-Type,X-Token" --cors-allowed-origins="*" --cors-allowed-methods="OPTIONS,DELETE,GET,POST" api --handler=http &


check(){
  local process=`ps -ef| grep $1 | grep -v grep`;
  if [ "$process" == "" ]; then
        echo "$1 exit";
        exit -1
  fi
}

while true
do
  sleep 2s
  check "config-srv"
  check "agent-api"
  check "admin-api"
  check "micro"
done
