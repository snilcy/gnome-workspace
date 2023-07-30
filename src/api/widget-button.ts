import { St } from './st'
import { Widget, IWidgetParams } from '.'
import type { Clutter } from '@girs/clutter-12'
import { Log } from 'src/utils'

interface IWidgetButtonParams {
  label?: any
}

export class WidgetButton extends Widget {
  constructor(params: IWidgetButtonParams & IWidgetParams) {
    super({
      ...params,
      container: ({ style_class }) =>
        new St.Button({
          label: String(params.label),
          style_class,
        }),
    })
  }
}
