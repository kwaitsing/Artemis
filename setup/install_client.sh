$!/bin/bash

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
echo -n "[Unit]
Description=ArtemisClient
After=multi-user.target
Wants=multi-user.target

[Service]
User=root
ExecStart=/opt/Artemis/ArtemisClient -r \"$1\" -n \"$2\" -k \"$3\"
Restart=on-failure

[Install]
WantedBy=multi-user.target" >/opt/ArtemisArtemisClient.service

# Download Core and
cd /opt/Artemis && curl -L 'https://github.com/kwaitsing/Artemis/releases/download/pkg/ArtemisClient' >ArtemisClient && chmod +x ArtemisClient && ln -sf /opt/Artemis/ArtemisClient.service /etc/systemd/system/