import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { classNames } from 'primereact/utils';
import { useForm } from 'react-hook-form';
import { addSize, listSize, removeSize, updateSize } from '../../api/size';
const SizePage = () => {
    let emptyProduct = {
        id: null,
        name: null,
        code: null,
    };
    const [sizes, setSizes] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [size, setSize] = useState(emptyProduct);
    const [editSize, setEditSize] = useState(false)
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);
    const dt = useRef(null);
    useEffect(() => {
        searchAll();
    }, []);

    const searchAll = () => {
        setLoading(true);
        listSize(
            {
                id: "",
                active: true,
                textSearch: "",
                pageReq: {
                    page: 0,
                    pageSize: 15,
                    sortField: "",
                    sortDirection: ""
                }
            }
        ).then((res) => {
            // const _paginator = { ...paginator };
            // _paginator.total = res.total;
            // setPaginator(_paginator);
            const _data = res?.data.data
            setSizes(_data);
            setLoading(false);
        });
    };
    const { register, handleSubmit, formState: { errors }, reset } = useForm()

    const onSubmit = data => {
        setLoading(true);
        if (editSize) {
            updateSize(data).then((res) => {
                searchAll();
                setLoading(false);
                setProductDialog(false)
                reset();
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sửa thành công', life: 1000 });
            })
        } else {
            addSize(data).then((res) => {
                searchAll();
                setLoading(false);
                setProductDialog(false)
                reset();
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Thêm thành công', life: 1000 });
            })
        }
    }

    const openNew = () => {
        setSize(emptyProduct)
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSize(emptyProduct)
        setProductDialog(false);
        setEditSize(false)
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const editProduct = (size) => {
        const data = {
            id: size?.id,
            name: size?.name,
            code: size?.code,
        }
        reset(data);
        setEditSize(true);
        setProductDialog(true);
    };


    const confirmDeleteProduct = (size) => {
        setSize(size);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        const ids = size
        removeSize(ids).then((res) => {
            if (res) {
                searchAll();
                // onChangeSelectedRows([]);
                setDeleteProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Xóa thành công', life: 1000 });
            }
        });
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = sizes.filter((val) => !selectedProducts.includes(val));
        setSizes(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
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
            <h5 className="m-0">Kích cỡ</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Tìm kiếm" />
            </span>
        </div>
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
                        value={sizes}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} sizes"
                        globalFilter={globalFilter}
                        emptyMessage="No sizes found."
                        header={header}
                        loading={loading}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="code" header="Mã Hex" sortable body={(d) => <span >{d.code}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Tên" sortable body={(d) => <span >{d.name}</span>} headerStyle={{ minWidth: '15rem' }}></Column>


                        <Column header="Chức năng" body={(d) => actionBodyTemplate(d)} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header={editSize ? "Sửa kích cỡ" : "Thêm mới kích cỡ"} modal className="p-fluid" onHide={hideDialog}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <InputText {...register('id')} id="id" hidden />
                            <div className="field">
                                <label htmlFor="code">Mã kích cỡ</label>
                                <InputText
                                    {...register('code', { required: true })}
                                    id="code"
                                    className={classNames({ 'p-invalid': errors.code })} />
                            </div>
                            <div className="field">
                                <label htmlFor="name">Tên kích cỡ</label>
                                <InputText
                                    {...register('name', { required: true })}
                                    id="name"
                                    className={classNames({ 'p-invalid': errors.name })} />
                            </div>

                            <div className='flex align-items-center justify-content-center'>
                                <Button label="Cancel" type='reset' icon="pi pi-times" text onClick={hideDialog} />
                                <Button label="Save" type='submit' icon="pi pi-check" text />
                            </div>
                        </form>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {size && (
                                <span>
                                    Bạn có chắc chắn muốn xóa <b>{size.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {size && <span>Are you sure you want to delete the selected sizes?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );

}

export default SizePage