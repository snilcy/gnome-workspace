/// <reference path="global.d.ts" />

interface IApi {
  GI: IGI;
  UI: IUI;
  Misc: IMisc;
  Gettext: string;
  Cairo: string;
  Log: typeof log;
  Me: object;
  Gtk: IGtk;
  Shell: Shell;
}

interface IImports {
  api: IApi;
}

interface IModule {
  imports: IImports;
}

interface IExtensionUtils {
  getCurrentExtension: () => IModule;
}

interface IMisc {
  extensionUtils: IExtensionUtils;
  config: string;
}
