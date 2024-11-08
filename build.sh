mkdir dist
#cd client && bun build --compile --minify --target=bun-linux-x64 --sourcemap ./index.ts --outfile ./ArtemisClient
#mv ArtemisClient ../dist
cd client-go && CGO_ENABLED=0 go build && mv ArtemisClient ../dist
cd ..
#cd server && bun build --compile --minify --target=bun-linux-x64-baseline --sourcemap ./src/index.ts --outfile ./ArtemisServer
cd server-go && CGO_ENABLED=0 go build && mv ArtemisServer ../dist
cd ..
cd frontend && bunx --bun vite build && mv ./dist ../dist/frontend && cd ../dist && tar zcvf frontend.tar.gz frontend/ && rm -rf ./frontend
