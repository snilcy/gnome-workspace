const { watch } = require('minimist')(process.argv.slice(2));
const { build, context } = require('esbuild');

const config = {
  entryPoints: [
    './src/extension.ts',
    // './src/api.ts',
    './src/prefs.ts',
  ],
  minify: false,
  format: 'esm',
  bundle: true,
  treeShaking: false,
  outdir: './build/',
  plugins: [],
  // logLevel: 'verbose',
  // external: ['gi://*'],
};

const main = async () => {
  if (watch) {
    const ctx = await context(config);
    await ctx.watch();
    console.log('watching...');
  } else {
    await build(config);
  }
};

main();
