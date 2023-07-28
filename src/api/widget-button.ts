import { St } from './st'
import { Widget } from '.'
import type { Clutter } from '@girs/clutter-12'
import { Log } from 'src/utils'

interface IWidgetButtonParams {
  label?: any
  children?: Widget
}

export class WidgetButton extends Widget {
  constructor(params: IWidgetButtonParams) {
    super({
      container: () =>
        new St.Button({
          label: String(params.label),
        }),
    })
  }
}
