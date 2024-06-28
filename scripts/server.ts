import { extname } from 'https://deno.land/std/path/mod.ts'

const port = 1234;
const server = Deno.listen({ port: port });
console.log(`File server running on http://localhost:${port}/`);

for await (const conn of server) {
	handleHttp(conn).catch(console.error);
}

async function handleHttp(conn: Deno.Conn) {
	const httpConn = Deno.serveHttp(conn);
	for await (const requestEvent of httpConn) {
		// Use the request pathname as filepath
		const url = new URL(requestEvent.request.url);
		let filepath = decodeURIComponent(url.pathname);
		if (filepath === '/') {
			filepath = '/index.html';
		}

		// Try opening the file
		let file;
		try {
			file = await Deno.open('priv/static' + filepath, { read: true });
		} catch {
			// If the file cannot be opened, return a '404 Not Found' response
			const notFoundResponse = new Response('404 Not Found', { status: 404 });
			await requestEvent.respondWith(notFoundResponse);
			continue;
		}

		// Build a readable stream so the file doesn't have to be fully loaded into
		// memory while we send it
		const readableStream = file.readable;
		const contentType = getContentType(filepath);

		// Build and send the response
		const response = new Response(readableStream, {
			headers: { 'content-type': contentType },
		});
		await requestEvent.respondWith(response);
	}
}

function getContentType(filepath) {
	const ext = extname(filepath);
	switch (ext) {
		case '.html':
			return 'text/html';
		case '.mjs':
			return 'application/javascript';
		case '.js':
			return 'application/javascript';
		case '.css':
			return 'text/css';
		case '.json':
			return 'application/json';
		case '.png':
			return 'image/png';
		case '.jpg':
		case '.jpeg':
			return 'image/jpeg';
		case '.gif':
			return 'image/gif';
		case '.svg':
			return 'image/svg+xml';
		case '.ico':
			return 'image/x-icon';
		default:
			return 'application/octet-stream';
	}
}