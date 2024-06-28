
import esbuild from 'esbuild';
import * as sass from 'sass';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import path from 'path';
import fs from 'fs';
import toml from 'toml';
import compile from './compile.js';
import { promises as fsPromises } from 'fs';

async function readConfig() {
	const configContent = await fsPromises.readFile('gleam.toml', 'utf-8');
	return toml.parse(configContent);
}

async function buildCSS(inputFile, outputFile) {
	// Compile sass to css
	const result = await sass.compileAsync(inputFile);
	const css = result.css;

	// Process CSS with PostCSS (TailwindCSS and Autoprefixer)
	const postcssResult = await postcss([tailwindcss, autoprefixer]).process(css, { from: inputFile, to: outputFile });
	await fsPromises.writeFile(outputFile, postcssResult.css);
	if (postcssResult.map) {
		await fsPromises.writeFile(outputFile + '.map', postcssResult.map.toString());
	}
}

async function build() {
	try {
		const config = await readConfig();
		const appName = config.name;
		const env = config.env || 'dev';
		const jsInputFile = `build/${env}/javascript/${appName}/${appName}.mjs`;
		const cssInputFile = 'src/styles/app.scss';
		const outputDir = 'priv/static';
		const jsOutputFile = path.join(outputDir, 'js', `${appName}.mjs`);
		const cssOutputFile = path.join(outputDir, 'css', `${appName}.css`);

		await compile();

		// Build Javascript
		await esbuild.build({
			entryPoints: [jsInputFile],
			bundle: true,
			minify: false,
			outfile: jsOutputFile,
			format: 'esm',
			loader: {
				'.mjs': 'js',
			}
		});

		// Build CSS
		await buildCSS(cssInputFile, cssOutputFile);

		const htmlSource = path.resolve('src/index.html');
		const htmlDest = path.resolve(outputDir, 'index.html');
		if (fs.existsSync(htmlSource)) {
			fs.copyFileSync(htmlSource, htmlDest);
		}
		console.log('Build complete');

	} catch (error) {
		console.error('Build failed:', error);
	}
}

build().catch(() => process.exit(1));

export default build;
    