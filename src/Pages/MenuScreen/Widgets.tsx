import { useDrag } from "react-dnd";
import "./MenuScreen.scss";

export interface BoxProps {
    name: string,
    canDrag: boolean
    data?: any;
}

interface DropResult {
    name: string;
}

export default function Widgets({ name, canDrag, data = {} }: BoxProps) {
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
            <div className="widget-box" ref={drag} style={{ opacity }} data-testid={`box`}>
                {name}
            </div>
        </>
    )
}
