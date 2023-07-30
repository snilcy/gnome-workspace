import { Logger } from '@snilcy/logger'
import { spawn } from 'child_process'
import { logger } from './logger.mjs'
const l = logger.ns('BUILD')

function spawnNodemon(execFile, watch) {
  try {
    const cp = spawn('nodemon', [execFile, '--watch', watch], {
      // the important part is the 4th option 'ipc'
      // this way `process.send` will be available in the child process (nodemon)
      // so it can communicate back with parent process (through `.on()`, `.send()`)
      // https://nodejs.org/api/child_process.html#child_process_options_stdio
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
    })

    cp.stdout.on('data', (data) => {
      console.log(data.toString().replace(/\n$/, ''))
    })

    cp.stderr.on('data', (data) => {
      // l.error(`stderr: ${data}`)
    })

    cp.on('close', (code) => {
      l.info('close', code)
    })

    cp.on('error', (err) => l.error(err))

    cp.on('start', () => lcss.info('App has started'))
      .on('quit', () => {
        lcss.info('App has quit')
        process.exit()
      })
      .on('restart', (files) => lcss.info('App restarted due to: ', files))

    return cp
  } catch (err) {
    l.error(err)
  }
}

spawnNodemon('./esbuild.mjs', './src/**/*.ts')
spawnNodemon('./scss.mjs', './src/**/*.scss')
