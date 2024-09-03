import { ReactNode, useEffect, useState } from "react";
import Chart from "../../Components/Chart/Chart";
import Table from "../../Components/Table/Table";
import GridLayout from "react-grid-layout";
import "./MenuScreen.scss";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { getMenuScreenById, getMenuScreens } from "./menu-screen-mapping.service";
import NoData from "../../Components/NoData/NoData";
import CardWidget from "../../Components/CardWidget/CardWidget";

export default function PageView() {

    const [layout, setLayout] = useState<any[]>([]);
    const [layoutData, setLayoutData] = useState<Record<string, any>>({});
    const [apiLoader, setApiLoader] = useState(true);
    const [menusLoader, setMenusLoader] = useState(true);
    const [menus, setMenus] = useState<any[]>([]);
    const [selectedMenu, setMenu] = useState<any | null>(null);


    useEffect(() => {
        getMenus()
    }, [])

    useEffect(() => {
        getMenuLayout()
    }, [selectedMenu])

    const getMenus = () => {
        getMenuScreens().then(res => {
            const data = res.data.data
            setMenus(data)
            setMenusLoader(false);
            if (data.length) {
                setMenu(data[0])
            } else {
                setLayout([])
                setLayoutData({})
                setApiLoader(false);
            }
        }).catch(() => {
            setMenus([])
            setLayout([])
            setLayoutData({})
            setMenusLoader(false);
            setApiLoader(false);
        })
    }

    const getMenuLayout = () => {
        if (!selectedMenu) {
            return
        }
        setApiLoader(true)
        getMenuScreenById(selectedMenu._id).then(res => {
            const data = res.data.data
            setLayout(data.layout)
            setLayoutData(data.data)
            setApiLoader(false);
        }).catch(() => {
            setLayout([])
            setLayoutData({})
            setApiLoader(false);
        })
    }

    const getNodeData = (_element: any, data: any) => {
        const component = data?.selected?.data ?? {}
        if (component.type === "graph") {
            return <Chart type={component.graph} />
        } else if (component.type === "table") {
            return <Table />
        } else if (component.type === "card") {
            return <CardWidget type={component.card} title={component.title} />
        }
    }

    function getElements(): ReactNode[] {
        return layout.map((e: any) => (
            <div className="block" key={e.i}>
                {
                    layoutData[e.i]?.selected ?
                        <>
                            {getNodeData(e, layoutData[e.i])}
                        </>
                        :
                        <>
                            <h2>N/A</h2>
                        </>
                }
            </div>
        ))
    }

    return (
        <>
            <div className="page-header">
                <div className="title">
                    Screen View
                </div>
                <div className="options">
                    <div className="option">
                        <Dropdown value={selectedMenu} onChange={(e: DropdownChangeEvent) => setMenu(e.value)} options={menus} optionLabel="name" checkmark={true}
                            placeholder="Select Menu" className="w-full" loading={menusLoader} disabled={!menus.length} />
                    </div>
                </div>
            </div>
            <div className="page-body">
                {
                    apiLoader ? <div className="h-full w-full flex align-items-center justify-content-center">
                        <ProgressSpinner />
                    </div>
                        :
                        <>
                            {
                                (menus.length && layout.length) ?
                                    <GridLayout className="layout" cols={12} rowHeight={50} width={screen.width - 32} layout={layout} isDraggable={false} isBounded={true} isDroppable={false} isResizable={false}>
                                        {...getElements()}
                                    </GridLayout> :
                                    <div className="col-12">
                                        <NoData title="No Data" text="Menus Not Available" />
                                    </div>
                            }
                        </>
                }
            </div>
            {/*  */}
        </>
    )
}
