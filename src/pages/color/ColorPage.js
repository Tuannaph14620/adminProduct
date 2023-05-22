import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { Rating } from 'primereact/rating';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { useDispatch, useSelector } from 'react-redux';
import { listCategory } from '../../features/categorySlice';
import { addColors, listColors, removeColors } from '../../features/colorSlice';
import { useForm } from 'react-hook-form';
import { addColor, listColor, removeColor } from '../../api/color';
const ColorPage = () => {
    let emptyProduct = {
        id: null,
        name: '',
        hex: ''
    };



    const [colors, setColors] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [dataColor, setDataColor] = useState(null);
    const [dataColorCreate, setDataColorCreate] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);
    const dt = useRef(null);

    // const color = useSelector(data => data.color.value)
    const dispatch = useDispatch();

    useEffect(() => {
        searchAll();
    }, []);

    const searchAll = () => {
        setLoading(true);
        listColor(
            {
                textSearch: "",
                active: false,
                textSearch: "",
                pageReq: {
                    page: 0,
                    pageSize: 10,
                    sortField: "",
                    sortDirection: ""
                }
            }
        ).then((res) => {

            // const _paginator = { ...paginator };
            // _paginator.total = res.total;
            const _data = res?.data.data            // setPaginator(_paginator);
            setColors(_data);
            setLoading(false);
        });
    };

    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    const onSubmit = data => {
        setLoading(true);
        addColor(data).then((res) => {
            searchAll();
            setLoading(false);
            setProductDialog(false)
            reset();
        })
    }

    const openNew = () => {
        setDataColor(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
        reset()
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };


    const editProduct = (product) => {
        setDataColor({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setDataColor(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        console.log(dataColor);
        // const ids = selectedRow.reduce((acc, cur) => [...acc, cur?.id], []);
        const ids = dataColor
        removeColor(ids).then((res) => {
            if (res) {
                searchAll();
                // onChangeSelectedRows([]);
                setDeleteProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 1000 });
            }
        });

    };

    const findIndexById = (id) => {
        // let index = -1;
        // for (let i = 0; i < products.length; i++) {
        //     if (products[i].id === id) {
        //         index = i;
        //         break;
        //     }
        // }

        // return index;
    };

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        // let _products = color.filter((val) => !selectedProducts.includes(val));
        // setProducts(_products);
        // setDeleteProductsDialog(false);
        // setSelectedProducts(null);
        // toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };

    const onInputChange = (e, name) => {
        // const val = (e.target && e.target.value) || '';
        // let _product = { ...color };
        // _product[`${name}`] = val;

        // setDataColor(_product);
    };
    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="sucess" className="mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };




    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-pencil" severity="success" rounded className="mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" severity="warning" rounded onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Products</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>

        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteSelectedProducts} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={colors}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage="No products found."
                        header={header}
                        responsiveLayout="scroll"
                        loading={loading}
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="code" header="Code" sortable body={(d) => <span >{d.name}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Name" sortable body={(d) => <span >{d.hex}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header="Màu sắc" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="field">
                                <label htmlFor="name">Tên màu sắc</label>
                                <InputText {...register('name', { required: true })} id="name" className={classNames({ 'p-invalid': errors.name })} />
                                {errors.name && <span style={{ color: 'red' }}>Bạn bắt buộc phải nhập tên màu sác</span>}
                            </div>
                            <div className="field">
                                <label htmlFor="hex">Mã hex</label>
                                <InputText {...register('hex', { required: true })} id="hex" className={classNames({ 'p-invalid': errors.name })} />
                                {errors.hex && <span style={{ color: 'red' }}>Bạn bắt buộc phải nhập mã hex màu sắc</span>}
                            </div>
                            <div className='flex align-items-center justify-content-center'>
                                <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
                                <Button label="Save" type='submit' icon="pi pi-check" text />
                            </div>
                        </form>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {colors && (
                                <span>
                                    Are you sure you want to delete <b>{colors.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {colors && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );

}

export default ColorPage