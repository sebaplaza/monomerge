const fs = require("fs-extra");
const fg = require("fast-glob");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

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
		const targetPath = `coverage/${packageName}.json`;
		console.log(`copy to: ${targetPath}`);
		return fs.copyFile(entry, targetPath);
	});
	await Promise.all(promises);

	const { stdout, stderr } = await exec(
		"npx nyc merge coverage .nyc_output/coverage.json"
	);
	console.log(`stdout: ${stdout}`);

	console.log(
		`now you can generate your reports with: npx nyc report. More info: https://istanbul.js.org/docs/advanced/coverage-object-report/ `
	);
})();
