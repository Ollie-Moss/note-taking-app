// Creates the on drop handler used by group and note cards
// Specific functions for updating and moving the item
//  are provided by the function user
// Allows for reuseability for other item types
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
