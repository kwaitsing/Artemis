# How to use (aka. manual for the end users)

1. Grab server, client, and frontend from github release
2. Deploy client on your servers, and server(this is the mothership where hold all your reported data) on your homeserver
3. deploy reverse_proxy with the Caddyfile example inside /server/

> Tips

If you get Illegal instruction then simple build the executable you need like this
`bun build --compile --minify --target=bun-linux-x64-baseline --sourcemap ./src/index.ts --outfile ./ArtemisServer`

# Client

> Args

|arg|default|desc|
|    :----:   |    :----:   |    :----:   |
|-r/--remote|ws://127.0.0.0:9702|Remote Server Addr|
|-k/--key|oATqKPjF72wau8MdJPhV|Remote Server Key|
|-n/--name|Infra|Local Server Name|
|-u/--updateinterval|1.2|Report Interval|
|-v/--verbose|false|Enable Verbose|

> Deployment with script

```bash
curl -fsSL https://github.com/kwaitsing/Artemis/releases/download/pkg/install_client.sh >install_client.sh

# arg1: Server WS Addr
# arg2: Server Name(shouldn't be the same with any other servers)
# arg3: passkey
bash install_client.sh ws://example.com MyServer EPdnpTjAr0EV5yuDXFf5
```

> Video showcase for the installation process

![configure_client.gif](https://github.com/kwaitsing/Artemis/blob/main/documents/configure_client.gif?raw=true)

> Example cmdline

`./client -r ws://example.com:9702 -k 'meowmeowmeow' -n 'NyaServer' -u 2.1 -v`



# Server

> Args

|arg|default|desc|
|    :----:   |    :----:   |    :----:   |
|-p/--port|9702|Listen port|
|-k/--key|oATqKPjF72wau8MdJPhV|AuthKey|

> Example cmdline

`./server -p 9011 -k 'meowmeowmeow'`

> Deployment

1. make sure `caddy` is installed in your system
2. ```bash
   curl -fsSL https://github.com/kwaitsing/Artemis/releases/download/pkg/install_server.sh >install_server.sh

   # arg1: Listen Port
   # arg2: passkey
   bash install_server.sh 8080 EPdnpTjAr0EV5yuDXFf5
   ```
3. `nano /opt/Artemis/ArtemisServer.service` to modify the config file
4. Navi to ../server/Caddyfile, read the comments in it
5. Copy or rewrite the configuration to your Caddyfile/Nginx conf
6. Download `frontend.tar.gz` and configure it as the example Caddyfile described
7. do `systemctl enable --now ArtemisServer.service` to launch the server

> Video showcase for the installation process

![server_base.gif](https://github.com/kwaitsing/Artemis/blob/main/documents/install_server.gif?raw=true)

![configure_frontend.gif](https://github.com/kwaitsing/Artemis/blob/main/documents/configure_frontend.gif?raw=true)