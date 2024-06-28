
import chokidar from 'chokidar';
import build from './build.js';
import { exec } from 'child_process';

async function startWatching() {

	const watcher = chokidar.watch(['src/**/*.gleam', 'src/styles/**/*.scss', 'src/styles/**/*.css', 'src/index.html'], {
		persistent: true
	});

	watcher.on('change', async (path) => {
		console.log(`File changed: ${path}`);
		try {
			await build();
		} catch (error) {
			console.error('Error during build:', error);
		}
	});

	console.log('Watching for changes...');

	exec('deno run --allow-read=. --allow-net scripts/server.ts', (error, stdout, stderr) => {
		if (error) {
			console.error(`Error starting server: ${error.message}`);
			return;
		}
		if (stderr) {
			console.error(`Server stderr: ${stderr}`);
			return;
		}
		console.log(`Server stdout: ${stdout}`);
	});
}

startWatching().catch(console.error);
    