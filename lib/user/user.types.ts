export interface EditorConfig_ {
  id: string;
  userId: string;
  theme?: string;
  fontSize?: number;
  tabSize?: number;
  wordWrap?: boolean;
  minimapEnabled?: boolean;
  lineNumbers?: boolean;
  keybindings?: any;
  typescriptPreferences?: any;
}

export interface UpdateEditorConfigData {
  theme?: string;
  fontSize?: number;
  tabSize?: number;
  wordWrap?: boolean;
  minimapEnabled?: boolean;
  lineNumbers?: boolean;
  keybindings?: any;
  typescriptPreferences?: any;
}