import Engine from '@/Engine';
import { AssetPackage, CNode, CPage } from '@chameleon/model';
import { i18n } from 'i18next';
import mitt, { Emitter } from 'mitt';
import { Workbench } from '../component/Workbench';
import { CustomI18n } from '../i18n';

export type PluginObj = {
  name: string;
  init: (ctx: CPluginCtx) => Promise<void>;
  destroy: (ctx: CPluginCtx) => Promise<void>;
  exports: (ctx: CPluginCtx) => any;
  meta: {
    engine: {
      version: string;
    };
  };
};

export type CPlugin = PluginObj | ((ctx: CPluginCtx) => PluginObj);

type PluginManagerOptions = {
  getWorkbench: () => Workbench;
  emitter: Emitter<any>;
  pageModel: CPage;
  i18n: CustomI18n;
  assets: AssetPackage[];
  engine: Engine;
};

export type CPluginCtx<C = any> = {
  globalEmitter: Emitter<any>;
  config: C;
  pluginManager: PluginManager;
  pluginReadyOk: () => void;
} & PluginManagerOptions;

export type PluginInstance = {
  ctx: CPluginCtx;
  exports: any;
  source: PluginObj;
  ready: boolean;
};

export class PluginManager {
  plugins: Map<string, PluginInstance> = new Map();
  emitter: Emitter<any> = mitt();
  getWorkbench!: () => Workbench;
  pageModel!: CPage;
  i18n: CustomI18n;
  assets: AssetPackage[];
  engine: Engine;

  constructor({ getWorkbench, emitter, pageModel, i18n, assets, engine }: PluginManagerOptions) {
    this.getWorkbench = getWorkbench;
    this.emitter = emitter;
    this.pageModel = pageModel;
    this.i18n = i18n;
    this.assets = assets;
    this.engine = engine;
  }

  createPluginCtx = () => {
    const ctx: CPluginCtx = {
      globalEmitter: this.emitter,
      emitter: mitt(),
      config: {},
      getWorkbench: this.getWorkbench,
      pluginManager: this,
      pageModel: this.pageModel,
      i18n: this.i18n,
      assets: this.assets,
      engine: this.engine,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      pluginReadyOk: () => {},
    };
    return ctx;
  };

  async add(plugin: CPlugin) {
    const ctx = this.createPluginCtx();

    let innerPlugin: PluginObj;
    if (typeof plugin === 'function') {
      innerPlugin = plugin(ctx);
    } else {
      innerPlugin = plugin;
    }
    const pluginCtx = {
      source: innerPlugin,
      ctx: ctx,
      exports: innerPlugin.exports?.(ctx) || {},
      ready: false,
    };
    ctx.pluginReadyOk = () => {
      this.emitter.emit(`${innerPlugin.name}:ready`);
      pluginCtx.ready = true;
    };
    this.plugins.set(innerPlugin.name, pluginCtx);
    await innerPlugin.init(ctx);
  }

  async get(pluginName: string) {
    const pluginInstance = this.plugins.get(pluginName);
    if (pluginInstance?.ready) {
      return pluginInstance;
    } else {
      await this.onPluginReadyOk(pluginName);
      return pluginInstance;
    }
    return;
  }

  async remove(name: string) {
    const p = this.plugins.get(name);
    await p?.source.destroy(p.ctx);
    this.plugins.delete(name);
  }

  onPluginReadyOk(pluginName: string, cb?: (pluginHandle: PluginInstance) => void) {
    const pluginObj = this.plugins.get(pluginName);
    if (pluginObj?.ready) {
      return;
    }

    return new Promise<PluginInstance>((resolve) => {
      this.emitter.on(`${pluginName}:ready`, () => {
        if (pluginObj) {
          pluginObj.ready = true;
          cb?.(pluginObj);
          resolve(pluginObj);
        }
      });
    });
  }
}
