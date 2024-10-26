mkdir dist
cd client && bun build --compile --minify --target=bun-linux-x64 --sourcemap ./index.ts --outfile ./client
mv client ../dist
cd ..
cd server && bun build --compile --minify --target=bun-linux-x64 --sourcemap ./src/index.ts --outfile ./server
mv server ../dist
cd ..
cd frontend && bunx --bun vite build && mv ./dist ../dist/frontend
