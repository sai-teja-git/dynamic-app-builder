import { Outlet } from 'react-router-dom';
import Header from '../Components/Header/Header';
import "./Pages.scss";

export default function Page() {
    return (
        <>
            <Header />
            <div className="page-container">
                <Outlet />
            </div>
        </>
    )
}
