import { Meta } from '@girs/meta-12';
// import type GLib from '@girs/glib-2.0';

interface Global {
  workspace_manager: Meta.WorkspaceManager;
  display: Meta.Display;
}

export declare global {
  const global: Global
}
