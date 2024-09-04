import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import "./Header.scss"

interface IHeaderMenu {
    path: string;
    name: string;
    children?: IHeaderMenu[];
}

export default function Header() {
    const [selectMenu, setMenu] = useState<any | null>(null);
    const menus: IHeaderMenu[] = [
        {
            path: "/dashboard/configuration",
            name: "Config"
        },
        {
            path: "/dashboard/view",
            name: "View"
        },
        {
            path: "/dashboard/e-chart",
            name: "E-Chart"
        },
        {
            path: "/menu-screen-mapping",
            name: "Menu Screen Mapping",
            children: [{
                path: "/edit-menu",
                name: "Edit Menu"
            }]
        }
    ]

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const returnMenu = (menusData: IHeaderMenu[]) => {
            for (const menuItem of menusData) {
                if (currentPath === menuItem.path) {
                    return menuItem
                }
                if (menuItem.children) {
                    const childMenu = returnMenu(menuItem.children)
                    if (childMenu) {
                        return menuItem
                    }
                }
            }
        }
        const currentPath = window.location.pathname
        const menu = returnMenu(menus)
        if (menu) {
            setMenu(menu)
        }
    }, [location])

    function redirectTo(event: any) {
        setMenu(event.value)
        navigate(event.value.path)
    }

    return (
        <nav className="app-header">
            <div className="title">
                App Builder
            </div>
            <div className="options">
                <div className="card flex justify-content-center">
                    <Dropdown value={selectMenu} onChange={(e: DropdownChangeEvent) => redirectTo(e)} options={menus} optionLabel="name" checkmark={true}
                        placeholder="Select Menu" className="w-full" />
                </div>
            </div>
        </nav >
    )
}
