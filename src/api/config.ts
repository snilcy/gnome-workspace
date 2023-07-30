interface IConfig {
  cssPrefix?: string
}

class ConfigClass {
  params: IConfig = {
    cssPrefix: '',
  }

  init(params: IConfig) {
    const cssPrefix = (params.cssPrefix || '').replace(/[^a-zA-Z-_]/gi, '-')

    this.params = {
      ...this.params,
      ...params,
      cssPrefix,
    }
  }

  getClassName(className: string) {
    if (!className) {
      return ''
    }

    return [this.params.cssPrefix, className].join('__')
  }
}

export const Config = new ConfigClass()
