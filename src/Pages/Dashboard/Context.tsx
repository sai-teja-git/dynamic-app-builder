import { CSSProperties, useEffect, useState } from "react";
import "./Dashboard.scss";
import { useDrop } from 'react-dnd'
import { InputText } from "primereact/inputtext";

interface IContext {
    contextLayout: any,
    allowedDropEffect: string,
    setLayoutTitle: Function,
    totalData: any
}

const style: CSSProperties = {
    height: '100%',
    width: '100%',
    color: 'var(--highlight-text-color)',
    textAlign: 'center',
    fontSize: '1rem',
    lineHeight: 'normal',
    float: 'left',
}

function selectBackgroundColor(isActive: boolean, canDrop: boolean) {
    if (isActive) {
        return 'var(--green-100)'
    } else if (canDrop) {
        return 'var(--indigo-300)'
    } else {
        return "var(--primary-100)"
    }
}

export default function Context({ contextLayout, totalData, allowedDropEffect, setLayoutTitle }: IContext) {

    const [selected, setSelected] = useState<any>(null)

    const [{ canDrop, isOver }, drop] = useDrop(
        () => ({
            accept: "box",
            drop: (e) => {
                setSelected(e)
                setLayoutTitle({
                    ...contextLayout,
                    selected: e
                })
                return {
                    name: `${contextLayout?.name} Container`,
                }
            },
            collect: (monitor: any) => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
            }),
        }),
        [allowedDropEffect],
    )

    const isActive = canDrop && isOver
    const backgroundColor = selectBackgroundColor(isActive, canDrop)

    useEffect(() => {
        if (contextLayout.selected) {
            setSelected(contextLayout.selected)
        }
    }, [])

    return (
        <>
            <br />
            {
                selected ?
                    <>
                        <div className="flex align-items-center justify-content-center">
                            You Selected&nbsp;<b>{selected.name}</b>&nbsp;in&nbsp;<b>{contextLayout?.name}</b>
                            {contextLayout?.selected?.data?.type}
                        </div>
                        <div>
                            {
                                contextLayout?.selected?.data?.type === "card" &&
                                <InputText type="text" className="p-inputtext-sm" placeholder="Card Name" value={contextLayout.selected.data.title ?? ""}
                                    onChange={(e) => setLayoutTitle({
                                        ...contextLayout,
                                        selected: {
                                            ...contextLayout.selected,
                                            data: {
                                                ...contextLayout.selected.data,
                                                title: e.target.value
                                            }
                                        }
                                    })} />
                            }
                        </div>
                    </>
                    :
                    <>
                        <div className="flex align-items-center justify-content-center" ref={drop} style={{ ...style, backgroundColor }}>
                            <div >
                                {isActive ? 'Release to drop' : 'Drag a box here'}
                            </div>
                        </div>
                    </>
            }
        </>

    )
}
