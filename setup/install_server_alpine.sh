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
cat <<EOF > /opt/Artemis/SRVArtemisServer
#!/sbin/openrc-run  
name="ArtemisServer"  
command="/opt/Artemis/ArtemisServer"  
command_args="-p "$1" -k "$2""  
pidfile="/run/\${RC_SVCNAME}.pid"  
command_background="yes"              
  
depend() {  
    need net   
}
EOF
chmod +x /opt/Artemis/SRVArtemisServer
# Download Core and
cd /opt/Artemis && curl -L 'https://github.com/kwaitsing/Artemis/releases/download/pkg/ArtemisServer' >ArtemisServer && chmod +x ArtemisServer && ln -sf /opt/Artemis/SRVArtemisServer /etc/init.d/