import { Button } from "primereact/button";
import { Skeleton } from "primereact/skeleton";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoData from "../../Components/NoData/NoData";
import { getMenuScreens } from "./menu-screen-mapping.service";

export default function MenuConfig() {

    const navigate = useNavigate();

    const [loadMenus, setLoadMenus] = useState(true);
    const [menusData, setMenusData] = useState<any[]>([])

    useEffect(() => {
        getMenuScreenData()
    }, [])

    const navigateToEdit = (menuData?: any) => {
        let stateObj: Record<string, any> = {}
        if (menuData) {
            stateObj.menuData = { id: menuData._id, name: menuData.name }
        }
        navigate(`/edit-menu`, { state: stateObj })
    }

    const getMenuScreenData = () => {
        getMenuScreens().then(res => {
            const data = res.data.data
            setMenusData([...data])
            setLoadMenus(false);
        }).catch(() => {
            setLoadMenus(false);
            setMenusData([])
        })
    }

    const menuLoadingTemplate = () => {
        return <>
            {
                Array(12).fill(null).map((_e, i) => (
                    <div className="col-2" key={i}>
                        <div className="border-round border-1 surface-border p-4 surface-card">
                            <Skeleton width="100%"></Skeleton>
                        </div>
                    </div>
                ))
            }
        </>
    }

    return (
        <>
            <div className="page-header">
                <div className="title">
                    Menu Config
                </div>
                <div className="options">
                    <div className="option">
                        <Button label="Add Menu" outlined size="small" icon="pi pi-plus" onClick={() => navigateToEdit()} />
                    </div>
                </div>
            </div>
            <div className="page-body">
                <div className="grid">
                    {loadMenus ? menuLoadingTemplate() :
                        <>
                            {
                                menusData.length ? <>
                                    {
                                        menusData.map(e => (
                                            !e.static && <div className="col-2 cursor-pointer" key={e._id} onClick={() => navigateToEdit(e)}>
                                                <div className="border-round border-1 surface-border p-4 surface-card">
                                                    {e.name}
                                                </div>
                                            </div>
                                        ))
                                    }
                                </> :
                                    <div className="col-12">
                                        <NoData title="No Data" />
                                    </div>
                            }
                        </>
                    }

                </div>
            </div>
        </>
    )
}
