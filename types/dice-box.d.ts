declare module '@3d-dice/dice-box' {
  export interface DiceBoxDieResult {
    sides: number | string;
    value: number;
    dieType?: string;
    rollId?: number | string;
    groupId?: number | string;
    theme?: string;
    themeColor?: string;
  }

  export interface DiceBoxGroupResult {
    sides: number | string;
    qty: number;
    value: number;
    modifier?: number;
    rolls: DiceBoxDieResult[];
  }

  export interface DiceBoxOptions {
    id?: string;
    container?: string | HTMLElement | null;
    assetPath: string;
    theme?: string;
    themeColor?: string;
    enableShadows?: boolean;
    shadowTransparency?: number;
    lightIntensity?: number;
    scale?: number;
    delay?: number;
    offscreen?: boolean;
    spinForce?: number;
    throwForce?: number;
    suspendSimulation?: boolean;
    preloadThemes?: string[];
    externalThemes?: Record<string, string>;
    onRollComplete?: (results: DiceBoxGroupResult[]) => void;
  }

  export interface DiceBoxRollOptions {
    theme?: string;
    themeColor?: string;
    newStartPoint?: boolean;
  }

  export default class DiceBox {
    constructor(options?: DiceBoxOptions);
    init(): Promise<this>;
    roll(
      notation: string | Array<string | { qty: number; sides: number | string; modifier?: number }>,
      options?: DiceBoxRollOptions
    ): Promise<DiceBoxGroupResult[]>;
    clear(): this;
    show(): this;
    hide(className?: string): this;
    updateConfig(options: Partial<DiceBoxOptions>): Promise<this>;
    loadTheme(theme: string): Promise<this>;
  }
}
