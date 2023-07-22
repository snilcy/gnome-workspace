import minimist from 'minimist'
import sass from 'sass'
import fs from 'node:fs'

const { watch } = minimist(process.argv.slice(2))

const result = sass.compile('./src/stylesheet.scss', {
  style: 'expanded',
})

fs.writeFileSync('./build/stylesheet.css', result.css, 'utf-8')
