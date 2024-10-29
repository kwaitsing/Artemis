#!/bin/bash

if [[ $EUID -ne 0 ]]; then
  echo "Error: This script must be run as root."
  exit 1
fi

if [ -z "$1" ]; then
  echo "Error: No ListenPort supplied."
  exit 1
fi

if [ -z "$2" ]; then
  echo "Error: No passkey supplied."
  exit 1
fi

# Create Folder
mkdir -p /opt/Artemis/

# Copy Service
echo -n "[Unit]
Description=ArtemisServer
After=multi-user.target
Wants=multi-user.target

[Service]
User=root
ExecStart=/opt/Artemis/ArtemisServer -p \"$1\" -k \"$2\"
Restart=on-failure

[Install]
WantedBy=multi-user.target" >/opt/Artemis/ArtemisServer.service

# Download Core and
cd /opt/Artemis && curl -L 'https://github.com/kwaitsing/Artemis/releases/download/pkg/ArtemisServer' >ArtemisServer && chmod +x ArtemisServer && ln -sf /opt/Artemis/ArtemisServer.service /etc/systemd/system/