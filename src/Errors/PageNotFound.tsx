import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Link } from 'react-router-dom';

export default function PageNotFound() {
    const header = (
        <img style={{ height: "70vh" }} alt="Card" src="https://primefaces.org/cdn/primereact/images/usercard.png" />
    );
    const footer = (
        <>
            <Link to={"/"}>
                <Button label="Back" icon="pi pi-arrow-right" iconPos='right' />
            </Link>
        </>
    );

    return (
        <div className="card flex justify-content-center">
            <Card title="Page Not Found" footer={footer} header={header} className="md:w-25rem">
            </Card>
        </div>
    )
}
