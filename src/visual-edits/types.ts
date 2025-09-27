export interface VisualEditComponent {
  name: string;
  filePath: string;
  props?: Record<string, any>;
  position?: {
    x: number;
    y: number;
  };
  bounds?: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

export interface VisualEditMessage {
  type: 'VISUAL_EDIT_UPDATE' | 'VISUAL_EDIT_SELECT' | 'VISUAL_EDIT_HOVER' | 'VISUAL_EDIT_READY';
  payload: {
    componentName?: string;
    filePath?: string;
    elementId?: string;
    changes?: Record<string, any>;
    position?: { x: number; y: number };
    url?: string;
    timestamp?: number;
  };
}

export interface VisualEditConfig {
  enabled: boolean;
  debugMode: boolean;
  targetOrigin: string;
}