import { db } from './db';

export interface PosCategory {
  id: number;
  name: string;
  children?: PosCategory[];
  parentId?: Array<number | string>;
}

export const posCategoryRepository = {
  db: db.table<PosCategory>('pos.category'),

  async all(): Promise<PosCategory[]> {
    return this.db.toArray();
  },

  async treeCategories(): Promise<PosCategory[]> {
    const allCategories = await this.all();

    const rootCategories = allCategories.filter(({ parentId }) => !parentId);
    const buildTree = (root: PosCategory): PosCategory => {
      const children = allCategories.filter(
        ({ parentId }) => parentId && parentId[0] === root.id,
      );
      return {
        id: root.id,
        name: root.name,
        children: children.map(buildTree),
      };
    };
    return rootCategories.map(buildTree);
  },
};
