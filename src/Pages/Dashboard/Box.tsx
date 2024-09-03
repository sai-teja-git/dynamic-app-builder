import type { CSSProperties, FC } from 'react'
import { useDrag } from 'react-dnd'


const style: CSSProperties = {
    border: '1px dashed gray',
    backgroundColor: 'white',
    padding: '0.5rem 1rem',
    marginRight: '1.5rem',
    marginBottom: '1.5rem',
    cursor: 'move',
    float: 'left',
    borderRadius: "6px"
}

export interface BoxProps {
    name: string,
    canDrag: boolean
    data?: any;
}

interface DropResult {
    name: string;
}

export const Box: FC<BoxProps> = function Box({ name, canDrag, data = {} }) {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "box",
        item: { name, data },
        canDrag: canDrag,
        end: (item, monitor) => {
            const dropResult = monitor.getDropResult<DropResult>()
            if (item && dropResult) {
                // alert(`You dropped ${item.name} into ${dropResult.name}!`)
            }
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            handlerId: monitor.getHandlerId(),
        }),
    }), [canDrag])

    const opacity = isDragging ? 0.4 : 1
    return (
        <>
            <div ref={drag} style={{ ...style, opacity }} data-testid={`box`}>
                {name}
            </div>
        </>
    )
}