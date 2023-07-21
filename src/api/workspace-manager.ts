import { Workspace } from './workspace'

const { workspace_manager: gWrokspaceManager } = global

const connect: typeof gWrokspaceManager.connect = (...args) => {
  return gWrokspaceManager.connect(...args)
}

export const WorkspaceManager = {
  connect,
  disconnect(id: number) {
    gWrokspaceManager.disconnect(id)
  },

  get workspaces() {
    const workspaces: Workspace[] = []
    const length = this.length

    for (let id = 0; id < length; id++) {
      const workspace = this.getWorkspaceById(id)
      if (workspace) {
        workspaces.push(workspace)
      }
    }

    return workspaces
  },

  getWorkspaceById(id: number) {
    const gWorkspace = gWrokspaceManager.get_workspace_by_index(id)
    if (gWorkspace) {
      return new Workspace(gWorkspace)
    }

    return null
  },

  get activeWorkspaceId() {
    return gWrokspaceManager.get_active_workspace_index()
  },

  isActiveWorkspaceId(id: number) {
    return gWrokspaceManager.get_active_workspace_index() === id
  },

  get length() {
    return gWrokspaceManager.get_n_workspaces()
  },
}
