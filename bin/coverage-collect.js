#!/usr/bin/env node

"use strict";

const fs = require("fs-extra");
const fg = require("fast-glob");
const path = require("path");
const { execSync } = require("child_process");

(async () => {
	const entries = await fg(["packages/*/coverage/coverage-final.json"], {
		dot: true,
		absolute: true,
	});

	await fs.emptyDir("coverage");
	await fs.emptyDir(".nyc_output");

	const promises = entries.map((entry) => {
		console.log(`coverage file found: ${entry}`);
		const rgPackageName = new RegExp(
			"packages/(.*)/coverage/coverage-final.json"
		);
		const [, packageName] = rgPackageName.exec(entry);
		const targetPath = path.join(process.cwd(), `coverage/${packageName}.json`);
		console.log(`copy to: ${targetPath}`);
		return fs.copyFile(entry, targetPath);
	});
	await Promise.all(promises);

	const mergedFileTargetPath = path.join(
		process.cwd(),
		`.nyc_output/coverage.json`
	);

	const stdout = execSync(`npx nyc merge coverage ${mergedFileTargetPath}`);
	console.log(stdout.toString());

	await fs.emptyDir("coverage");
	console.log(`folder 'coverage' cleaned`);
	console.log(
		`now you can generate your reports with: npx nyc report. More info: https://istanbul.js.org/docs/advanced/coverage-object-report/ `
	);
})();
