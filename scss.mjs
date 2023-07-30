import minimist from 'minimist'
import * as sass from 'sass'
import metadata from './build/metadata.json' assert { type: 'json' }
import fs from 'node:fs'
import { logger } from './logger.mjs'
const l = logger.ns('SCSS')

const formatedUUID = metadata.uuid.replace(/[^a-zA-Z-_]/gi, '-')

const { watch } = minimist(process.argv.slice(2))

const result = sass.compile('./src/stylesheet.scss', {
  style: 'expanded',
  functions: {
    'uuid()': function () {
      return new sass.SassString(formatedUUID)
    },
  },
})

l.info(result.loadedUrls.map((url) => url.pathname))
fs.writeFileSync('./build/stylesheet.css', result.css, 'utf-8')
