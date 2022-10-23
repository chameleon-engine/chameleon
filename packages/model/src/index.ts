import { CPage } from './Page/index';

export const parsePageModel = (data: any) => {
  return new CPage(data);
};

export * from './Material';
export * from './Page';
export * from './Page/Schema';
export * from './Page/Schema/Node/index';
export * from './Page/Schema/Node/prop';
export * from './Page/Schema/Node/slot';
export * from './const/schema';

export * from './types/base';
export * from './types/material';
export * from './types/node';
export * from './types/page';
export * from './types/schema';

export * from './util/index';
