import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { addProduct, listProduct, removeProduct, updateProduct } from '../../api/product';
import { InputTextarea } from 'primereact/inputtextarea';
import moment from 'moment/moment';
import { listCate } from '../../api/category';
import { listMaterial } from '../../api/material';
import { useNavigate } from 'react-router-dom';
import { classNames } from 'primereact/utils';
const ProductPage = () => {
    let emptyProduct = {
        id: null,
        name: null,
        des: null,
        categoryId: null,
        materialId: null,
        height: null,
        length: null,
        weight: null,
        width: null
    };
    const [products, setProducts] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [category, setCategory] = useState(null);
    const [material, setMaterial] = useState(null);
    const [editStatus, setEditStatus] = useState(false)
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errors, setErrors] = useState({ field: "" });
    const toast = useRef(null);
    const dt = useRef(null);
    const navigator = useNavigate()
    useEffect(() => {
        searchAll();
    }, []);

    const searchAll = () => {
        setLoading(true);
        listProduct(
            {
                "active": true,
                "minPrice": "",
                "maxPrice": "",
                "pageReq": {
                    "page": 0,
                    "pageSize": 15,
                    "sortField": "",
                    "sortDirection": ""
                }
            }
        ).then((res) => {
            // const _paginator = { ...paginator };
            // _paginator.total = res.total;
            // setPaginator(_paginator);
            const _data = res?.data.data
            setProducts(_data);
            setLoading(false);
        });
    };

    const getAll = () => {
        listCate(
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
            const _data = res?.data.data.map((e) => {
                return {
                    ...e,
                    id: e.id,
                    nameCate: e.name
                }
            })
            setCategory(_data);
        });
        listMaterial(
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
            const _data = res?.data.data.map((e) => {
                return {
                    ...e,
                    id: e.id,
                    nameMaterial: e.name
                }
            })
            setMaterial(_data);
        })
    }

    const onSubmit = (event) => {
        setLoading(true);
        event.preventDefault();
        if (!validate()) {
            setLoading(false);
            return;
        }
        setErrors({ field: '' })
        if (editStatus) {
            updateProduct(product).then((res) => {
                if (res) {
                    searchAll();
                    setLoading(false);
                    setProduct(emptyProduct);
                    setEditStatus(false)
                    setProductDialog(false)
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sửa thành công', life: 1000 });
                }

            })
        } else {
            addProduct(product).then((res) => {
                if (res) {
                    searchAll();
                    setLoading(false);
                    setProduct(emptyProduct);
                    setProductDialog(false)
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Thêm thành công', life: 1000 });
                }
            })
        }
    }

    const openNew = () => {
        getAll();
        setErrors({ field: '' });
        setProduct(emptyProduct)
        setProductDialog(true);
    };

    const hideDialog = () => {
        setProduct(emptyProduct);
        setProductDialog(false);
        setEditStatus(false)
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const editProduct = (data) => {
        setEditStatus(true);
        setProduct({ ...data });
        getAll();
        setProductDialog(true);
    };


    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };
    const deleteProduct = () => {
        const ids = product?.id
        removeProduct(ids).then((res) => {
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
        let _products = products.filter((val) => !selectedProducts.includes(val));
        setProducts(_products);
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
                <Button icon="pi pi-eye" severity="secondary" rounded className="mr-2" onClick={() => navigator(`/products/${rowData.id}`)} />
                <Button icon="pi pi-trash" severity="warning" rounded onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">Sản phẩm</h4>
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
    const validate = () => {
        const _dataTable = { ...product };
        const _error = { ...errors };
        if (!_dataTable.name) {
            _error.field = "name";
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập tên sản phẩm', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.des) {
            _error.field = 'des';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập mô tả', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (_dataTable.des && _dataTable.des.length < 20) {
            _error.field = 'des';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Mô tả ít nhất 20 kí tự', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.categoryId) {
            _error.field = 'categoryId';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập danh mục sản phẩm', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.materialId) {
            _error.field = 'materialId';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập nguyên liệu', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.height) {
            _error.field = 'height';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập chiều cao', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.length) {
            _error.field = 'length';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập chiều dài', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.weight) {
            _error.field = 'weight';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập cân nặng', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.width) {
            _error.field = 'width';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập chiều rộng', life: 3000 });
            setErrors(_error);
            return false;
        }
        return true;
    }
    const setRowData = (value, field) => {

        const table = { ...product };
        switch (field) {
            default: {
                setErrors({ field: '' });
                table[field] = value;
            }
        }

        setProduct(table);
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <DataTable
                        ref={dt}
                        value={products}
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
                        loading={loading}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="name" header="Tên sản phẩm" sortable body={(d) => <span >{d.name}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="categoryName" header="Tên danh mục" sortable body={(d) => <span >{d.categoryName}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="materialName" header="Nguyên liệu" sortable body={(d) => <span >{d.materialName}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="des" header="Mô tả" sortable body={(d) => <span >{d.des}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="qty" header="Số lượng" sortable body={(d) => <span >{d?.qty}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="maxPrice" header="Giá thấp nhất" sortable body={(d) => <span >{d?.maxPrice?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="minPrice" header="Giá cao nhất" sortable body={(d) => <span >{d?.minPrice?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column header="Chức năng" body={(d) => actionBodyTemplate(d)} headerStyle={{ minWidth: '15rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header={editStatus ? "Sửa sản phẩm " : "Thêm mới sản phẩm"} modal className="p-fluid" onHide={hideDialog}>
                        <form onSubmit={onSubmit} >
                            <div className="field">
                                <label htmlFor="name">Tên sản phẩm</label>
                                <InputText
                                    onChange={(event) => setRowData(event.target.value, "name")}
                                    value={product.name}
                                    className={classNames({ 'p-invalid': errors.field === 'name' })}
                                    id="name" />
                            </div>
                            <div className="field">
                                <label htmlFor="des">Mô tả</label>
                                <InputTextarea
                                    id="des"
                                    value={product.des}
                                    onChange={(event) => setRowData(event.target.value, "des")}
                                    className={classNames({ 'p-invalid': errors.field === 'des' })}
                                    rows={3} cols={20} />
                            </div>
                            <div className="field">
                                <label htmlFor="height">Danh mục sản phẩm</label>
                                <Dropdown
                                    value={product?.categoryId}
                                    options={category}
                                    showClear
                                    filter
                                    optionLabel="nameCate"
                                    optionValue="id"
                                    className={classNames({ 'p-invalid': errors.field === 'categoryId' })}
                                    onChange={(event) => setRowData(event.target.value, "categoryId")}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="height">Nguyên liệu</label>
                                <Dropdown
                                    value={product?.materialId}
                                    options={material}
                                    showClear
                                    filter
                                    optionLabel="nameMaterial"
                                    optionValue="id"
                                    onChange={(event) => setRowData(event.target.value, "materialId")}
                                    className={classNames({ 'p-invalid': errors.field === 'materialId' })}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="height">Height</label>
                                <InputNumber
                                    value={product.height}
                                    onChange={(event) => setRowData(event.value, "height")}
                                    className={classNames({ 'p-invalid': errors.field === 'height' })}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="length">Length</label>
                                <InputNumber
                                    value={product.length}
                                    onChange={(event) => setRowData(event.value, "length")}
                                    className={classNames({ 'p-invalid': errors.field === 'length' })}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="weight">Weight</label>
                                <InputNumber
                                    value={product.weight}
                                    onChange={(event) => setRowData(event.value, "weight")}
                                    className={classNames({ 'p-invalid': errors.field === 'weight' })}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="width">Width</label>
                                <InputNumber
                                    value={product.width}
                                    onChange={(event) => setRowData(event.value, "width")}
                                    className={classNames({ 'p-invalid': errors.field === 'width' })}
                                />
                            </div>
                            <div className='flex align-items-center justify-content-center'>
                                <Button label="Hủy" type='reset' icon="pi pi-times" text onClick={hideDialog} />
                                <Button label="Lưu" icon="pi pi-check" loading={loading} />
                            </div>
                        </form>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Bạn có chắc chắn muốn xóa <b>{product.code}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );

}

export default ProductPage