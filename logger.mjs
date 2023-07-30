import { Logger } from '@snilcy/logger'

export const logger = new Logger('', {
  console: {
    deep: 6,
    undefined: false,
    excludeKeys: [],
    lineTerminators: true,
  },
})
