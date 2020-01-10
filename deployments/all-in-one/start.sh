#!/bin/sh

/root/config-srv &
/root/agent-api &
/root/admin-api &
/root/micro --cors-allowed-headers="Content-Type,X-Token" --cors-allowed-origins="*" --cors-allowed-methods="OPTIONS,DELETE,GET,POST" api --handler=http
