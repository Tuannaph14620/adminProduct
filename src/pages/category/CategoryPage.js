import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { addCate, listCate, removeCate, updateCate } from '../../api/category';
import { Image } from 'primereact/image';
import TemplateDemo from '../../component/FileUpload';
const CategoryPage = () => {
    let emptyProduct = {
        id: null,
        name: null,
        image: null,
        des: null
    };
    const [categorys, setCategorys] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [category, setCategory] = useState(emptyProduct);
    const [editCate, setEditCate] = useState(false)
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
        listCate(
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
            setCategorys(_data);
            setLoading(false);
        });
    };

    const onSubmit = () => {
        setLoading(true);
        if (editCate) {
            updateCate(category).then((res) => {
                searchAll();
                setLoading(false);
                setCategory(emptyProduct)
                setProductDialog(false)
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sửa thành công', life: 1000 });
            })
        } else {
            addCate(category).then((res) => {
                searchAll();
                setLoading(false);
                setProductDialog(false)
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Thêm thành công', life: 1000 });
            })
        }

    }

    const openNew = () => {
        setCategory(emptyProduct)
        setProductDialog(true);
    };

    const hideDialog = () => {
        setCategory(emptyProduct)
        setProductDialog(false);
        setEditCate(false)
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const editProduct = (category) => {
        const data = {
            id: category?.id,
            name: category?.name,
            des: category?.des,
            image: category?.image
        }
        setEditCate(true)
        setCategory({ ...data });
        setProductDialog(true);
    };


    const confirmDeleteProduct = (category) => {
        setCategory(category);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        const ids = category
        removeCate(ids).then((res) => {
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
        let _products = categorys.filter((val) => !selectedProducts.includes(val));
        setCategorys(_products);
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

    const imageBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
            </>
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
            <h5 className="m-0">Danh mục sản phẩm</h5>
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
    const setRowData = (value, field) => {
        const table = { ...category };
        switch (field) {
            default: {
                table[field] = value;
            }
        }
        setCategory(table);
    };

    const callbackFunction = (childData) => {
        const _image = { ...category }
        _image.image = childData
        setCategory(_image)
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={categorys}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} categorys"
                        globalFilter={globalFilter}
                        emptyMessage="No categorys found."
                        header={header}
                        loading={loading}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="name" header="Tên danh mục" sortable body={(d) => <span >{d.name}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="desc" header="Mô tả" sortable body={(d) => <span >{d.des}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column header="Ảnh" body={imageBodyTemplate}></Column>
                        <Column header="Chức năng" body={(d) => actionBodyTemplate(d)} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '600px' }} header={editCate ? "Sửa danh mục sản phẩm" : "Thêm mới danh mục sản phẩm"} modal className="p-fluid" onHide={hideDialog}>
                        <form >
                            <div className="field">
                                <label htmlFor="name">Tên danh mục</label>
                                <InputText
                                    value={category.name}
                                    onChange={(event) => setRowData(event.target.value, "name")}
                                    id="name" />
                            </div>
                            <div className="field ">
                                <label htmlFor="image">Ảnh danh mục</label>
                                <TemplateDemo parentCallback={callbackFunction}></TemplateDemo>
                                <Image hidden={!editCate} src={category?.image} alt="Image" width="100" />
                            </div>
                            <div className="field">
                                <label htmlFor="description">Mô tả</label>
                                <InputTextarea
                                    onChange={(event) => setRowData(event.target.value, "des")}
                                    value={category.des}
                                    id="des"
                                    rows={3} cols={20} />
                            </div>
                            <div className='flex align-items-center justify-content-center'>
                                <Button label="Cancel" type='reset' icon="pi pi-times" text onClick={hideDialog} />
                                <Button label="Save" type='submit' icon="pi pi-check" loading={loading} onClick={() => onSubmit()} />
                            </div>
                        </form>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {category && (
                                <span>
                                    Are you sure you want to delete <b>{category.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {category && <span>Are you sure you want to delete the selected categorys?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );

}

export default CategoryPage