import { ReactNode, useEffect, useState } from "react";
import GridLayout from "react-grid-layout";
import "./Dashboard.scss";

export default function View() {

    const [layout, setLayout] = useState<any[]>([]);
    const [layoutData, setLayoutData] = useState<Record<string, any>>({});

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

    function getElements(): ReactNode[] {
        return layout.map((e: any) => (
            <div className="block" key={e.i}>
                {
                    layoutData[e.i]?.selected ?
                        <>
                            You Selected&nbsp;<b>{layoutData[e.i]?.selected?.name}</b>&nbsp;in&nbsp;<b>{layoutData[e.i]?.name}</b>
                        </>
                        :
                        <>
                            <b>{layoutData[e.i]?.name}</b>
                        </>
                }
            </div>
        ))
    }

    return (
        <>
            <GridLayout className="layout" cols={12} rowHeight={50} width={1200} layout={layout} isDraggable={false} isBounded={true} isDroppable={false} isResizable={false}>
                {...getElements()}
            </GridLayout>
        </>
    )
}
