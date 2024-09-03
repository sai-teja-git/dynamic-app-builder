import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { MenuItem } from "primereact/menuitem";
import { ProgressSpinner } from "primereact/progressspinner";
import { SpeedDial } from "primereact/speeddial";
import { ReactNode, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import GridLayout from "react-grid-layout";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import Context from "../Dashboard/Context";
import { createMenuScreen, getMenuScreenById, updateMenuScreen } from "./menu-screen-mapping.service";
import "./MenuScreen.scss";
import Widgets from "./Widgets";


export default function EditMenu() {
    const navigate = useNavigate()
    const { state } = useLocation();
    const [layout, setLayout] = useState<any[]>([]);
    const [layoutData, setLayoutData] = useState<Record<string, any>>({});
    const [layoutOptions, setLayoutOptions] = useState({
        isDraggable: true,
        isDroppable: true,
        isResizable: true,
        isAddable: true
    })
    const [enableEdit, setEnableEdit] = useState(true);
    const [menuName, setMenuName] = useState("");
    const [loadLayout, setLoadLayout] = useState(false);
    const [loadSaving, setLoadSaving] = useState(false)

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
        setDefaultData()
    }, [])

    const setDefaultData = async () => {
        const { menuData } = state
        if (menuData) {
            setLoadLayout(true)
            await getMenuScreenById(menuData.id).then(res => {
                const data = res.data.data
                setMenuName(data.name)
                setLayout(data.layout)
                setLayoutData(data.data)
                setLoadLayout(false)
            }).catch(() => {
                setLoadLayout(false)
            })
        }
    }

    const setDialMenuData = (layoutData: any, index: number): MenuItem[] => {
        return items.map(e => ({
            ...e,
            data: {
                layoutData, index
            }
        }))
    }

    const getElements = (): ReactNode[] => {
        return layout.map((e: any, index: number) => (
            <div className="block" key={e.i}>
                <div className="layout-delete">
                    <SpeedDial model={setDialMenuData(e, index)} direction="left" showIcon="pi pi-bars" buttonClassName="button-size" style={{ top: 'calc(50% - 2rem)', right: 0 }} disabled={loadSaving} />
                </div>
                <Context key={e.i} contextLayout={layoutData[e.i]} totalData={layoutData} allowedDropEffect="copy" setLayoutTitle={(event: any) => {
                    setLayoutData(previous => ({
                        ...previous,
                        [e.i]: event
                    }))
                }} />
            </div>
        ))
    }


    const deleteLayout = (index: number) => {
        const layoutTemp = [...layout];
        layoutTemp.splice(index, 1)
        setLayout([...layoutTemp])
    }

    const onLayoutChange = (layout: any,): void => {
        setLayout([...layout])
    };

    const addBlock = () => {
        const key = uuidv4()
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

    const resetLayout = () => {
        setLayout([])
        setLayoutData({})
    }

    const saveLayOut = () => {
        if (!menuName) {
            toast.warning('Menu Name Required')
            return
        }
        setEnableEdit(false)
        setLoadSaving(true)
        const body: any = {
            name: menuName,
            layout: layout,
            data: layoutData
        }
        let apiFunction: Function = createMenuScreen;
        let params = [body]
        const isUpdate = state?.menuData?.name ? true : false;
        if (isUpdate) {
            apiFunction = updateMenuScreen
            delete body.name;
            params = [state?.menuData?.id, body]
        }
        apiFunction(...params).then(() => {
            navigate("/menu-screen-mapping")
        }).catch((e: any) => {
            toast.error(e?.response?.data?.message ?? `${isUpdate ? "Update Failed" : "Creation Failed"}`, { duration: 1500 })
            setLoadSaving(false)
        })
    }

    const widgetTemplate = () => {
        const data = [
            {
                name: "Bar Graph",
                canDrag: !enableEdit && !loadSaving,
                data: { graph: "bar", type: "graph" }
            },
            {
                name: "Line Graph",
                canDrag: !enableEdit && !loadSaving,
                data: { graph: "line", type: "graph" }
            },
            {
                name: "Table",
                canDrag: !enableEdit && !loadSaving,
                data: { type: "table" }
            },
            {
                name: "KPI Card",
                canDrag: !enableEdit && !loadSaving,
                data: { type: "card", card: "KPI" }
            },
            {
                name: "Data Card",
                canDrag: !enableEdit && !loadSaving,
                data: { type: "card", card: "DATA" }
            }
        ]
        return <>
            {
                data.map((e, i) => <Widgets {...e} key={i} />)
            }
        </>
    }

    return (
        <>
            <div className="page-header">
                <div className="title">
                    Screen Builder
                </div>
                <div className="options">
                    <div className="option">
                        <InputText type="text" className="p-inputtext-sm" placeholder="Menu Name" value={menuName}
                            disabled={loadLayout || state?.menuData?.name} onChange={(e) => setMenuName(e.target.value)} />
                    </div>
                    <div className="flex option">
                        <Checkbox inputId="enableEdit" name="options" onChange={(e) => setEnableEdit(e.target.checked ?? false)} checked={enableEdit} disabled={loadLayout || loadSaving} />
                        <label htmlFor="enableEdit" className="ml-1">Enable Edit</label>
                    </div>
                    <div className="option">
                        <Button label="Reset" size="small" text severity="danger" onClick={() => resetLayout()} disabled={!layout.length || loadLayout || loadSaving} />
                    </div>
                    <div className="option">
                        <Button label="Add Layout" severity="secondary" outlined size="small" icon="pi pi-plus" onClick={addBlock} disabled={!enableEdit || loadLayout || loadSaving} />
                    </div>
                    <div className="option">
                        <Button label="Save" size="small" icon="pi pi-check-circle" onClick={() => saveLayOut()} disabled={!layout.length || loadLayout || loadSaving} loading={loadSaving} />
                    </div>
                    <div className="option">
                        <Button label="Back" severity="secondary" outlined size="small" icon="pi pi-angle-left" onClick={() => navigate("/menu-screen-mapping")} disabled={loadSaving} />
                    </div>
                </div>
            </div>
            <div className="page-body">
                {
                    loadLayout ? <div className="h-full w-full flex align-items-center justify-content-center">
                        <ProgressSpinner />
                    </div> :
                        <DndProvider backend={HTML5Backend}>
                            <div className="config-layout">
                                <div className="widgets">
                                    {widgetTemplate()}
                                </div>
                                <div className="edit-options">
                                    <div className="flex option">
                                        <Checkbox inputId="ingredient3" name="options" onChange={(e) => setLayoutOptions({
                                            ...layoutOptions,
                                            isResizable: e.target.checked ?? false
                                        })} checked={layoutOptions.isResizable && enableEdit} disabled={!enableEdit} />
                                        <label htmlFor="ingredient3" className="ml-1">Enable Resize</label>
                                    </div>
                                    <div className="flex option">
                                        <Checkbox inputId="ingredient4" name="options" onChange={(e) => setLayoutOptions({
                                            ...layoutOptions,
                                            isAddable: e.target.checked ?? false
                                        })} checked={layoutOptions.isAddable && enableEdit} disabled={!enableEdit} />
                                        <label htmlFor="ingredient4" className="ml-1">Enable Add</label>
                                    </div>
                                    <div className="flex option">
                                        <Checkbox inputId="ingredient1" name="options" onChange={(e) => setLayoutOptions({
                                            ...layoutOptions,
                                            isDraggable: e.target.checked ?? false
                                        })} checked={layoutOptions.isDraggable && enableEdit} disabled={!enableEdit} />
                                        <label htmlFor="ingredient1" className="ml-1">Enable Drag</label>
                                    </div>
                                    <div className="flex option">
                                        <Checkbox inputId="ingredient2" name="options" onChange={(e) => setLayoutOptions({
                                            ...layoutOptions,
                                            isDroppable: e.target.checked ?? false
                                        })} checked={layoutOptions.isDroppable && enableEdit} disabled={!enableEdit} />
                                        <label htmlFor="ingredient2" className="ml-1">Enable Drop</label>
                                    </div>
                                </div>
                            </div>
                            <div className="builder-layout">
                                <GridLayout className="layout"
                                    cols={12} rowHeight={50} width={screen.width - 32} layout={layout}
                                    onLayoutChange={(e) => onLayoutChange(e)}
                                    resizeHandles={['s', 'w', 'e', 'n', 'sw', 'nw', 'se', 'ne']}
                                    isResizable={layoutOptions.isResizable && enableEdit} isDraggable={layoutOptions.isDraggable && enableEdit} isDroppable={layoutOptions.isDroppable && enableEdit} >
                                    {...getElements()}
                                </GridLayout>
                            </div>
                        </DndProvider>
                }
            </div>
        </>
    )
}
