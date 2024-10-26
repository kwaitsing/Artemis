mkdir dist
cd client && bun build --compile --minify --target=bun-linux-x64 --sourcemap ./index.ts --outfile ./ArtemisClient
mv ArtemisClient ../dist
cd ..
cd server && bun build --compile --minify --target=bun-linux-x64 --sourcemap ./src/index.ts --outfile ./ArtemisServer
mv ArtemisServer ../dist
cd ..
cd frontend && bunx --bun vite build && mv ./dist ../dist/frontend
