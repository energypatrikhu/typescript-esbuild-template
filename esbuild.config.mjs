import { build } from 'esbuild';
import { existsSync, rmSync, readFileSync } from 'node:fs';

const __sourceFile = './src/index.ts';
const __destinationDir = './build';

console.log(`Cleaning '${__destinationDir}'...`);
try {
	if (existsSync(__destinationDir)) {
		rmSync(__destinationDir, { force: true, recursive: true });
	}
	console.log(`Cleaned '${__destinationDir}'`);
} catch (error) {
	console.error(`Failed to clean '${__destinationDir}'`);
	throw error;
}

console.log(
	`\nMinifying '${__sourceFile}' into '${__destinationDir}' directory...`,
);
try {
	const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'));
	await build({
		entryPoints: [__sourceFile],
		platform: 'node',
		bundle: true,
		outdir: __destinationDir,
		logLevel: 'silent',
		treeShaking: true,
		minify: true,
		format: 'cjs',
		external: [
			...Object.keys(packageJson.optionalDependencies || {}),
			...Object.keys(packageJson.bundledDependencies || {}),
			...Object.keys(packageJson.peerDependencies || {}),
			...Object.keys(packageJson.devDependencies || {}),
			...Object.keys(packageJson.dependencies || {}),
		],
	});
	console.log(
		`Minified '${__sourceFile}' into '${__destinationDir}' directory`,
	);
} catch (error) {
	console.error(
		`Failed to minify '${__sourceFile}' into '${__destinationDir}' directory`,
	);
	throw error;
}
