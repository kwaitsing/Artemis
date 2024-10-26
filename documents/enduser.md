# How to use (aka. manual for the end users)

1. Grab server, client, and frontend from github release
2. Deploy client on your servers, and server(this is the mothership where hold all your reported data) on your homeserver
3. deploy reverse_proxy with the Caddyfile example inside /server/

> Tips

If you get Illegal instruction then simple build the executable you need like this
`bun build --compile --minify --target=bun-linux-x64-baseline --sourcemap ./src/index.ts --outfile ./ArtemisServer`

# Client args

|arg|default|desc|
|    :----:   |    :----:   |    :----:   |
|-r/--remote|ws://127.0.0.0:9702|Remote Server Addr|
|-k/--key|oATqKPjF72wau8MdJPhV|Remote Server Key|
|-n/--name|Infra|Local Server Name|
|-u/--updateinterval|1.2|Report Interval|
|-v/--verbose|false|Enable Verbose|

> Example cmdline

`./client -r ws://example.com:9702 -k 'meowmeowmeow' -n 'NyaServer' -u 2.1 -v`

# Server args

|arg|default|desc|
|    :----:   |    :----:   |    :----:   |
|-p/--port|9702|Listen port|
|-k/--key|oATqKPjF72wau8MdJPhV|AuthKey|

> Example cmdline

`./server -p 9011 -k 'meowmeowmeow'`