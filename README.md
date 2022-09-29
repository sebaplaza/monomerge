# monomerge

Merge multiple json coverage files into one, then use nyc to create a merged report. Ideal for monorepos.

## How to

```shell
npm add -D monomerge nyc
```

```shell
npx monomerge
```

This command will find all your `coverage-final.json` files into your `packages/*/coverage/coverage-final.json` folders.

All these files will be merged into `.nyc_output/coverage.json` file.

Now you can do whathever you want with this merged coverage file.

## Generate a report

Just call nyc with your prefered Options

```shell
npx nyc report --reporter=html --reporter=lcov
# or via a nyc config file https://github.com/istanbuljs/nyc#configuration-files
```
