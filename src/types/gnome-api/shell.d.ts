interface IShellApp {}

interface IShellWindowTracker {
  /*
   * The global Shell.WindowTracker instance
   */
  get_default(): IShellWindowTracker;

  /*
   * Look up the application corresponding to a process.
   */
  get_app_from_pid(
    /*
     * A Unix process identifier
     */
    pid: number,
  ): IShellApp | null;
}
