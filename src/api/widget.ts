import { St } from './st'
import type { Clutter as IClutter } from '@girs/clutter-12'
import type { St as ISt } from '@girs/st-12'
import { Log } from 'src/utils'
import { Config } from '.'
import { Clutter } from './clutter'

type IWidgetContainer = () => ISt.Widget

type IOnClickHandler = (event: IClutter.ButtonEvent) => void

type IEffect = 'desaturate'

type IOnMouseEnterHanlder = (
  widget: Widget,
  event: IClutter.CrossingEvent,
) => void

type IOnMouseLeaveHanlder = (
  widget: Widget,
  event: IClutter.CrossingEvent,
) => void

interface IWidgetParams {
  onClick?: IOnClickHandler
  onMouseEnter?: IOnMouseEnterHanlder
  onMouseLeave?: IOnMouseLeaveHanlder
  children?: Widget
  gChildren?: IClutter.Actor
  container?: IWidgetContainer
  className?: string
}

const DEFAULT_CONTAINER = St.BoxLayout

export class Widget {
  params: IWidgetParams = {}

  constructor(params: IWidgetParams = {}) {
    this.params = params

    if (params.onClick) {
      this.onClick(params.onClick)
    }

    if (params.onMouseEnter) {
      this.onMouseEnter(params.onMouseEnter)
    }

    if (params.onMouseLeave) {
      this.onMouseLeave(params.onMouseLeave)
    }
  }

  private containerWidget?: ISt.Widget

  get className() {
    return this.container.style_class
  }

  set className(className: string | null) {
    this.container.style_class = className
      ? Config.getClassName(className)
      : null
  }

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
      this.containerWidget = new DEFAULT_CONTAINER({
        reactive: true,
        can_focus: true,
        track_hover: true,
        style_class: Config.getClassName(this.params.className || ''),
      })
    }

    if (this.params.children) {
      this.containerWidget.insert_child_at_index(
        this.params.children.container,
        0,
      )
    }

    if (this.params.gChildren) {
      this.containerWidget.insert_child_at_index(this.params.gChildren, 0)
    }

    return this.containerWidget
  }

  appendChildren(widget: Widget, index: number = -1) {
    this.container.insert_child_at_index(widget.container, index)
  }

  appendChildrens(childs: Widget[]) {
    childs.forEach((child) => this.appendChildren(child))
  }

  destroyChildrens() {
    this.container.destroy_all_children()
  }

  destroy() {
    try {
      if (this.container) {
        this.container.destroy()
      }
    } catch (e) {
      // Log(e as Error)
    }
  }

  set opacity(value: number) {
    this.container.opacity = 255 * value
  }

  onClick(handler: IOnClickHandler) {
    this.container.connect(
      'button-release-event',
      (_, event: IClutter.ButtonEvent) => {
        handler(event)
      },
    )
  }

  onMouseEnter(handler: IOnMouseEnterHanlder) {
    this.container.connect('enter-event', (actor, event) => {
      handler(this, event)
    })
  }

  onMouseLeave(handler: IOnMouseLeaveHanlder) {
    this.container.connect('leave-event', (actor, event) => {
      handler(this, event)
    })
  }

  addEffect(effect: IEffect) {
    switch (effect) {
      case 'desaturate':
        this.container.add_effect(new Clutter.DesaturateEffect())
        break

      default:
        break
    }
  }
}
