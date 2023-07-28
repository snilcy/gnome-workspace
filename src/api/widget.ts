import { St } from './st'
import type { Clutter } from '@girs/clutter-12'
import { Log } from 'src/utils'

type IWidgetContainer = () => Clutter.Actor

type IOnClickHandler = (event: Clutter.ButtonEvent) => void

interface IWidgetParams {
  onClick?: IOnClickHandler
  children?: Widget
  container?: IWidgetContainer
}

const DEFAULT_CONTAINER = St.BoxLayout

export class Widget {
  params: IWidgetParams = {}

  constructor(params: IWidgetParams = {}) {
    Log('Widget.constructor', params)
    this.params = params

    if (params.onClick) {
      this.onClick(params.onClick)
    }
  }

  private containerWidget?: Clutter.Actor

  get container() {
    if (this.containerWidget) {
      return this.containerWidget
    }

    if (this.params.container) {
      this.containerWidget =
        typeof this.params.container === 'function'
          ? this.params.container()
          : this.params.container
    } else {
      this.containerWidget = new DEFAULT_CONTAINER()
    }

    if (this.params.children) {
      this.containerWidget.insert_child_at_index(
        this.params.children.container,
        0,
      )
    }

    return this.containerWidget
  }

  appendChildren(widget: Widget, index: number = -1) {
    Log('Widget.appendChildren', widget)
    Log(this.container)
    this.container.insert_child_at_index(widget.container, index)
  }

  appendChildrens(childs: Widget[]) {
    Log('Widget.appendChildrens', childs.length)
    childs.forEach((child) => this.appendChildren(child))
  }

  destroyChildrens() {
    Log('Widget.destroyChildrens')
    this.container.destroy_all_children()
  }

  destroy() {
    Log('Widget.destroy', this.container)
    try {
      if (this.container) {
        this.container.destroy()
      }
    } catch (e) {
      // Log(e as Error)
    }
  }

  onClick(handler: IOnClickHandler) {
    this.container.connect(
      'button-release-event',
      (_, event: Clutter.ButtonEvent) => {
        handler(event)
        // return true
      },
    )
  }
}
