import { flatten } from '../../utils/arrays';

export interface IItem {
	id: string
	name: string
}
export interface IHierarchyItem extends IItem {
	children: IHierarchyItem[]
}

export interface IFlatItem extends IItem {
	parentId?: string
	path: string
}

export const theFakeRoot = {name: "ROOT", id: "ROOT_DUMMY"}

export const pathSep = "."

export const getItemPath = (item: {name: string, path: string}) => item.path + pathSep + item.name

/** Accepts hierarchical data from graphlQL and produces a flattend list with `parentId` references and `path` segments. */
export const flattenItems = (parentId: string, pathList: Array<string>, root: IHierarchyItem, addPropsInput?: (item: IHierarchyItem) => {}): Array<IFlatItem> => {
	const addProps: (item: IHierarchyItem) => {} = addPropsInput || ((x) => ({}))
	const path = pathList.length ? pathList.reduce((x, y) => x + pathSep + y) : ""
	const composeItem = ({children: _, ...allButChildren}: IHierarchyItem) => ({ parentId, path, ...allButChildren, ...addProps(root)} as IFlatItem)
	const me = composeItem(root)
	return [me, ...flatten((root.children || []).map(x => flattenItems(me.id, [...pathList, me.name], x, addProps)))]
}

/** An item loaded outside it's hierarchy (but optionally with a `children` structure) is converted to a state compatible format, with `path`. */
export const setupItemForLifeInState = <T extends IFlatItem>(state: T[], item: IHierarchyItem & {parentId: string},
				currentParent: IFlatItem = state.find(x => x.id === item.parentId) || {...theFakeRoot, path: ""}): T =>
		flattenItems(currentParent.id, [...currentParent.path.split(pathSep).filter(x => x), currentParent.name], item)[0] as T
