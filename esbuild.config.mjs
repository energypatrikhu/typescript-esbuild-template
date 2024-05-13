import { build } from 'esbuild';
import { existsSync, rmSync, readFileSync } from 'node:fs';

const __sourceFile = './src/index.ts';
const __destinationFile = './build/index.js';

console.log(`Removing '${__destinationFile}'...`);
try {
	if (existsSync(__destinationFile)) {
		rmSync(__destinationFile, { force: true, recursive: true });
	}
	console.log(`Removed '${__destinationFile}'`);
} catch (error) {
	console.error(`Failed to remove '${__destinationFile}'`);
	throw error;
}

console.log(
	`\nMinifying '${__sourceFile}' into '${__destinationFile}' file...`,
);
try {
	const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
	await build({
		entryPoints: [__sourceFile],
		platform: 'node',
		bundle: true,
		outfile: __destinationFile,
		logLevel: 'silent',
		treeShaking: true,
		minify: true,
		format: 'cjs',
		external: (() => {
			const dependencies = new Set();
			for (const key in packageJson) {
				if (key.toLowerCase().endsWith('dependencies')) {
					for (const dep in packageJson[key]) {
						dependencies.add(dep);
					}
				}
			}
			return [...dependencies.values()];
		})(),
	});
	console.log(`Minified '${__sourceFile}' into '${__destinationFile}' file`);
} catch (error) {
	console.error(
		`Failed to minify '${__sourceFile}' into '${__destinationFile}' file`,
	);
	throw error;
}
