/// <reference path="global.d.ts" />

interface IExtensionApi {
  GI: IGI;
  UI: IUI;
  Misc: IMisc;
  Gettext: string;
  Cairo: string;
  Log: typeof log;
  Me: object;
}

interface IExtensionImports {
  api: IExtensionApi;
}

interface IExtension {
  imports: IExtensionImports;
}

interface IExtensionUtils {
  getCurrentExtension: () => IExtension;
}

interface IMisc {
  extensionUtils: IExtensionUtils;
  config: string;
}
