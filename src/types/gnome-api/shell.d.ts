declare namespace Shell {
  interface IApp {}

  interface IWindowTracker extends ITarget {
    /*
     * The global Shell.WindowTracker instance
     */
    get_default(): IWindowTracker;

    /*
     * Look up the application corresponding to a process.
     */
    get_app_from_pid(
      /*
       * A Unix process identifier
       */
      pid: number,
    ): IApp | null;
  }

  export const WindowTracker: Shell.IWindowTracker;
}
