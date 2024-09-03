import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { MenuItem } from "primereact/menuitem";
import { SpeedDial } from "primereact/speeddial";
import { ReactNode, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import GridLayout from "react-grid-layout";
import { Box } from "./Box";
import Context from "./Context";
import "./Dashboard.scss";

export default function DashboardConfig() {

    const [layout, setLayout] = useState<any[]>([]);
    const [layoutData, setLayoutData] = useState<Record<string, any>>({});
    const [layoutOptions, setLayoutOptions] = useState({
        isDraggable: true,
        isDroppable: true,
        isResizable: true,
        isAddable: true
    })
    const [enableEdit, setEnableEdit] = useState(true);

    const items: MenuItem[] = [
        {
            label: 'Delete',
            icon: 'pi pi-trash',
            className: "dial-button delete",
            command: (e) => {
                deleteLayout(e.item.data?.index)
            },
        },
        {
            label: 'Update',
            icon: 'pi pi-pencil',
            className: "dial-button",
            command: () => { }
        },
        {
            label: 'Remove Selection',
            icon: 'pi pi-refresh',
            className: "dial-button remove",
            command: (e) => {
                try {
                    delete layoutData[e.item.data.layoutData.i].selected
                    setLayoutData({ ...layoutData })
                } catch { }
            }
        }
    ];

    useEffect(() => {
        const sessionLayout = sessionStorage.getItem("layout")
        const sessionLayoutData = sessionStorage.getItem("layoutData")
        if (sessionLayout) {
            setLayout(JSON.parse(sessionLayout))
        }
        if (sessionLayoutData) {
            setLayoutData(JSON.parse(sessionLayoutData))
        }
    }, [])

    function setDialMenuData(layoutData: any, index: number): MenuItem[] {
        return items.map(e => ({
            ...e,
            data: {
                layoutData, index
            }
        }))
    }

    function getElements(): ReactNode[] {
        return layout.map((e: any, index: number) => (
            <div className="block" key={e.i}>
                <div className="layout-delete">
                    <SpeedDial model={setDialMenuData(e, index)} direction="left" showIcon="pi pi-bars" buttonClassName="button-size" style={{ top: 'calc(50% - 2rem)', right: 0 }} />
                </div>
                <Context key={e.i} layoutData={layoutData[e.i]} allowedDropEffect="copy" />
            </div>
        ))
    }

    function deleteLayout(index: number) {
        const layoutTemp = [...layout];
        layoutTemp.splice(index, 1)
        setLayout([...layoutTemp])
    }

    function onLayoutChange(layout: any,): void {
        setLayout([...layout])
    };

    function addBlock() {
        const key = new Date().getTime().toString()
        const nextNum = layoutData?.nextNum + 1 || 1
        setLayoutData({
            ...layoutData,
            [key]: {
                name: `Grid-${nextNum}`
            },
            nextNum
        })
        setLayout([
            ...layout,
            { i: key, x: 0, y: 0, w: 1, h: 1 }
        ])
    }

    function resetLayout() {
        setLayout([])
        setLayoutData({})
    }

    function saveLayOut() {
        sessionStorage.setItem("layout", JSON.stringify(layout))
        sessionStorage.setItem("layoutData", JSON.stringify(layoutData))
    }

    return (
        <>
            <div className="config-header">
                <div className="start">
                    <div className="card flex flex-wrap justify-content-center gap-3">
                        <div>
                            <Button label="Add Item" severity="secondary" outlined size="small" icon="pi pi-plus" onClick={() => addBlock()} disabled={!layoutOptions.isAddable || !enableEdit} />
                        </div>
                        <div>
                            <Button label="Reset" size="small" text severity="danger" onClick={() => resetLayout()} />
                        </div>
                        <div className="flex align-items-center gap-3">
                            <div className="flex align-items-center">
                                <Checkbox inputId="enableEdit" name="options" onChange={(e) => setEnableEdit(e.target.checked ?? false)} checked={enableEdit} />
                                <label htmlFor="enableEdit" className="ml-1">Enable Edit</label>
                            </div>
                            <div className="flex align-items-center">
                                <Checkbox inputId="ingredient3" name="options" onChange={(e) => setLayoutOptions({
                                    ...layoutOptions,
                                    isResizable: e.target.checked ?? false
                                })} checked={layoutOptions.isResizable && enableEdit} disabled={!enableEdit} />
                                <label htmlFor="ingredient3" className="ml-1">Enable Resize</label>
                            </div>
                            <div className="flex align-items-center">
                                <Checkbox inputId="ingredient4" name="options" onChange={(e) => setLayoutOptions({
                                    ...layoutOptions,
                                    isAddable: e.target.checked ?? false
                                })} checked={layoutOptions.isAddable && enableEdit} disabled={!enableEdit} />
                                <label htmlFor="ingredient4" className="ml-1">Enable Add</label>
                            </div>
                            <div className="flex align-items-center">
                                <Checkbox inputId="ingredient1" name="options" onChange={(e) => setLayoutOptions({
                                    ...layoutOptions,
                                    isDraggable: e.target.checked ?? false
                                })} checked={layoutOptions.isDraggable && enableEdit} disabled={!enableEdit} />
                                <label htmlFor="ingredient1" className="ml-1">Enable Drag</label>
                            </div>
                            <div className="flex align-items-center">
                                <Checkbox inputId="ingredient2" name="options" onChange={(e) => setLayoutOptions({
                                    ...layoutOptions,
                                    isDroppable: e.target.checked ?? false
                                })} checked={layoutOptions.isDroppable && enableEdit} disabled={!enableEdit} />
                                <label htmlFor="ingredient2" className="ml-1">Enable Drop</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="end">
                    <Button label="Save" size="small" icon="pi pi-check-circle" onClick={() => saveLayOut()} />
                </div>
            </div>
            <DndProvider backend={HTML5Backend}>
                <div style={{ overflow: 'hidden', clear: 'both' }}>
                    <Box name="Bar Graph" canDrag={!enableEdit} data={{ graph: "bar", type: "graph" }} />
                    <Box name="Line Graph" canDrag={!enableEdit} data={{ graph: "line", type: "graph" }} />
                    <Box name="Table" canDrag={!enableEdit} data={{ type: "table" }} />
                    <Box name="Card" canDrag={!enableEdit} data={{ type: "card" }} />
                </div>
                <GridLayout className="layout"
                    cols={12} rowHeight={50} width={screen.width - 32} layout={layout}
                    onLayoutChange={(e) => onLayoutChange(e)}
                    // onDrop={() => setEdited(true)}
                    // onResize={() => setEdited(true)}
                    // onDragStop={() => setEdited(true)}

                    resizeHandles={['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']}
                    isResizable={layoutOptions.isResizable && enableEdit} isDraggable={layoutOptions.isDraggable && enableEdit} isDroppable={layoutOptions.isDroppable && enableEdit} >
                    {...getElements()}
                </GridLayout>
            </DndProvider>
        </>
    )
}
