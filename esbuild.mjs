import minimist from 'minimist'
import esbuild from 'esbuild'
import fs from 'node:fs'
import { Logger } from '@snilcy/logger'
import { codeFrameColumns } from '@babel/code-frame'

const { watch } = minimist(process.argv.slice(2))

const l = new Logger('', {
  console: {
    deep: 6,
    undefined: false,
    excludeKeys: [],
    lineTerminators: true,
  },
})

const callbackPlugin = {
  name: '@snilcy/callbacks',
  setup(build) {
    let count = 0
    build.onStart(() => {
      // l.info('Started')
    })

    build.onEnd((result) => {
      console.clear()
      const { errors, warnings } = result

      const r = {
        errors: errors.length,
        warnings: warnings.length,
      }

      l.info('Rebuild', count++, r)

      errors.concat(warnings).forEach(({ location, text }) => {
        const result = codeFrameColumns(
          fs.readFileSync(location.file, 'utf-8'),
          {
            start: {
              line: location.line,
              column: location.column,
            },
            end: {
              line: location.line,
              column: location.column,
            },
          },
          {
            highlightCode: true,
            message: text,
          },
        )

        console.log(result)
      })
    })

    build.onDispose(() => {
      l.info('Dispose')
    })
  },
}

const config = {
  entryPoints: ['./src/extension.ts', './src/prefs.ts'],
  minify: false,
  format: 'esm',
  bundle: true,
  treeShaking: false,
  outdir: './build/',
  plugins: watch ? [callbackPlugin] : [],
  legalComments: 'none',
}

const main = async () => {
  if (watch) {
    const ctx = await esbuild.context(config)
    await ctx.watch()
  } else {
    await esbuild.build(config)
  }
}

main()
