export type HasParentId = { parentId: string };
export function createOnDrop({ update, move }: {
    update: (updates: Partial<HasParentId>) => void,
    move: (targetId: string, position: "before" | "after") => void
}) {
    return (target: Element, position: 'top' | 'middle' | 'bottom') => {
        const targetId = target.getAttribute('data-item-id');
        if (target.getAttribute('data-group') && position == 'middle') {
            update({ parentId: targetId });
            return
        }
        if (position == 'top' || position == 'bottom') {
            const mappedPosition = position == 'top' ? 'before' : 'after'
            move(targetId, mappedPosition)
        }
    }
}
