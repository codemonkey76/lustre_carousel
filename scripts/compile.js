
import { exec } from 'child_process';

async function compile() {
	return new Promise((resolve, reject) => {
		exec('gleam build', (error, stdout, stderr) => {
			if (error) {
				console.error(`Error: ${error.message}`);
				reject(error);
				return;
			}
			if (stderr) {
				console.error(`stderr: ${stderr}`);
				reject(new Error(stderr));
				return;
			}
			console.log(`stdout: ${stdout}`);
			resolve(stdout);
		});
	});
}
export default compile;
