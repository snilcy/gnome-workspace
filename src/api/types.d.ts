import type { Meta } from '@girs/meta-12';
import type { Shell } from '@girs/shell-12';

interface Global {
  workspace_manager: Meta.WorkspaceManager;
  display: Meta.Display;
}

export declare global {
  const global: Global;
}
