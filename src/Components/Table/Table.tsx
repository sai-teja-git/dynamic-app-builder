import { DataTable, DataTableValue } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { useEffect, useState } from 'react';
import { Skeleton } from 'primereact/skeleton';
import { productService } from './product.service';

interface Product {
    id: string;
    code: string;
    name: string;
    description: string;
    image: string;
    price: number;
    category: string;
    quantity: number;
    inventoryStatus: string;
    rating: number;
}

/**
 * Common Table Component
 */
export default function Table() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loadTable, setLoadTable] = useState(true)

    useEffect(() => {
        getTableData()
    }, []);

    const getTableData = () => {
        setLoadTable(true)
        productService.getProducts().then((data: any) => {
            setProducts(data)
            setLoadTable(false)
        });
    }

    const formatCurrency = (value: number) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'INR' });
    };

    const priceBodyTemplate = (product: Product) => {
        return formatCurrency(product.price);
    };

    const ratingBodyTemplate = (product: Product) => {
        return <Rating value={product.rating} readOnly cancel={false} />;
    };

    const statusBodyTemplate = (product: Product) => {
        return <Tag value={product.inventoryStatus} severity={getSeverity(product)}></Tag>;
    };

    const getSeverity = (product: Product) => {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Products</span>
            <Button icon="pi pi-refresh" rounded raised onClick={getTableData} />
        </div>
    );
    const footer = `In total there are ${products ? products.length : 0} products.`;

    const tableLoaderTemplate = () => {
        const items: DataTableValue[] = Array.from({ length: 10 }, (_v, i) => ({ i }));
        return <>
            <DataTable value={items}>
                <Column field="name" header="Name" body={<Skeleton />}></Column>
                <Column field="price" header="Price" body={<Skeleton />} ></Column>
                <Column field="category" header="Category" body={<Skeleton />}></Column>
                <Column field="rating" header="Reviews" body={<Skeleton />} ></Column>
                <Column header="Status" body={<Skeleton />} ></Column>
            </DataTable>
        </>
    }

    return (
        <>
            <div className="card h-full w-full overflow-auto">
                {
                    loadTable ? tableLoaderTemplate() :
                        <DataTable value={products} header={header} footer={footer} tableStyle={{ minWidth: '60rem' }}>
                            <Column field="name" header="Name"></Column>
                            <Column field="price" header="Price" body={priceBodyTemplate}></Column>
                            <Column field="category" header="Category"></Column>
                            <Column field="rating" header="Reviews" body={ratingBodyTemplate}></Column>
                            <Column header="Status" body={statusBodyTemplate}></Column>
                        </DataTable>
                }

            </div>
        </>
    )
}
