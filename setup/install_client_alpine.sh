#!/bin/bash

if [[ $EUID -ne 0 ]]; then
  echo "Error: This script must be run as root."
  exit 1
fi

if [ -z "$1" ]; then
  echo "Error: No WSremote supplied."
  exit 1
fi

if [ -z "$2" ]; then
  echo "Error: No name supplied."
  exit 1
fi

if [ -z "$3" ]; then
  echo "Error: No Passkey supplied."
  exit 1
fi

# Create Folder
mkdir -p /opt/Artemis/

# Copy Service
echo -n "#!/sbin/openrc-run  
name=\"ArtemisClient\"  
command=\"/opt/Artemis/ArtemisClient\"  
command_args=\"-r \"$1\" -n \"$2\" -k \"$3\"\"  
pidfile=\"/run/${\RC_SVCNAME}.pid\"  
command_background=\"yes\"              
  
depend() {  
    need net   
}" >/opt/Artemis/SRVArtemisClient

chmod +x /opt/Artemis/SRVArtemisClient

# Download Core and
cd /opt/Artemis && curl -L 'https://github.com/kwaitsing/Artemis/releases/download/pkg/ArtemisClient' >ArtemisClient && chmod +x ArtemisClient && ln -sf /opt/Artemis/SRVArtemisClient /etc/init.d/