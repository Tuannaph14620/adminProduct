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
    const [errors, setErrors] = useState({ field: "" });
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
                    pageSize: 100,
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

    const onSubmit = (event) => {
        setLoading(true);
        event.preventDefault();
        if (!validate()) {
            setLoading(false);
            return;
        }
        setErrors({ field: '' })
        if (editSize) {
            updateSize(size).then((res) => {
                searchAll();
                setLoading(false);
                setProductDialog(false)
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sửa thành công', life: 1000 });
            })
        } else {
            addSize(size).then((res) => {
                searchAll();
                setLoading(false);
                setProductDialog(false)
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sửa thành công', life: 1000 });
            })
        }
    }

    const openNew = () => {
        setSize(emptyProduct)
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSize(emptyProduct);
        setErrors({ field: '' });
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
        setSize(data)
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
                    <Button label="Thêm mới" icon="pi pi-plus" severity="sucess" className="mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Xuất" icon="pi pi-upload" severity="help" onClick={exportCSV} />
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
            <h4 className="m-0">Kích cỡ</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Tìm kiếm" />
            </span>
        </div>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="Không" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Có" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="Không" icon="pi pi-times" text onClick={hideDeleteProductsDialog} />
            <Button label="Có" icon="pi pi-check" text onClick={deleteSelectedProducts} />
        </>
    );
    const validate = () => {
        const _dataTable = { ...size };
        const _error = { ...errors };
        if (!_dataTable.code) {
            _error.field = "code";
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập mã kích cỡ', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.name) {
            _error.field = 'name';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập tên kích cỡ', life: 3000 });
            setErrors(_error);
            return false;
        }
        return true;
    }
    const setRowData = (value, field) => {
        const table = { ...size };
        switch (field) {
            default: {
                setErrors({ field: '' })
                table[field] = value;
            }
        }
        setSize(table);
    };
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
                        <Column field="code" header="Mã kích cỡ" sortable body={(d) => <span >{d.code}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="name" header="Tên kích cỡ" sortable body={(d) => <span >{d.name}</span>} headerStyle={{ minWidth: '15rem' }}></Column>


                        <Column header="Chức năng" body={(d) => actionBodyTemplate(d)} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header={editSize ? "Sửa kích cỡ" : "Thêm mới kích cỡ"} modal className="p-fluid" onHide={hideDialog}>
                        <form onSubmit={onSubmit}>
                            <div className="field">
                                <label htmlFor="code">Mã kích cỡ</label>
                                <InputText
                                    id="code"
                                    value={size.code}
                                    onChange={(event) => setRowData(event.target.value, "code")}
                                    className={classNames({ 'p-invalid': errors.field === 'code' })} />
                            </div>
                            <div className="field">
                                <label htmlFor="name">Tên kích cỡ</label>
                                <InputText
                                    id="name"
                                    value={size.name}
                                    onChange={(event) => setRowData(event.target.value, "name")}
                                    className={classNames({ 'p-invalid': errors.field === 'name' })} />
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