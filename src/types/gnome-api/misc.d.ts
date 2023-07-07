interface IExtensionUtils {
  getCurrentExtension: () => void;
}

interface Imisc {
  extensionUtils: IExtensionUtils;
  config: string;
}
