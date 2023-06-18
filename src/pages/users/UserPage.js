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
import { addCate, listCate, listUser, removeCate, updateCate } from '../../api/user';
import { Image } from 'primereact/image';
import TemplateDemo from '../../component/FileUpload';
import moment from 'moment';
const UserPage = () => {
    let emptyProduct = {
        id: null,
        name: null,
        image: null,
        des: null
    };
    const [users, setUsers] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [user, setUser] = useState(emptyProduct);
    const [statusEdit, setStatusEdit] = useState(false)
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
        listUser(
            {
                email: "",
                status: "",
                role: "",
                pageReq: {
                    page: 0,
                    pageSize: 15,
                    sortField: "createdDate",
                    sortDirection: "desc"
                }
            }
        ).then((res) => {
            // const _paginator = { ...paginator };
            // _paginator.total = res.total;
            // setPaginator(_paginator);
            const _data = res?.data.data
            setUsers(_data);
            setLoading(false);
        });
    };

    const onSubmit = () => {
        setLoading(true);
        if (statusEdit) {
            updateCate(user).then((res) => {
                searchAll();
                setLoading(false);
                setUser(emptyProduct)
                setProductDialog(false)
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sửa thành công', life: 1000 });
            })
        } else {
            addCate(user).then((res) => {
                searchAll();
                setLoading(false);
                setProductDialog(false)
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Thêm thành công', life: 1000 });
            })
        }

    }

    const openNew = () => {
        setUser(emptyProduct)
        setProductDialog(true);
    };

    const hideDialog = () => {
        setUser(emptyProduct)
        setProductDialog(false);
        setStatusEdit(false)
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const editProduct = (user) => {
        const data = {
            id: user?.id,
            name: user?.name,
            des: user?.des,
            image: user?.image
        }
        setStatusEdit(true)
        setUser({ ...data });
        setProductDialog(true);
    };


    const confirmDeleteProduct = (user) => {
        setUser(user);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        const ids = user
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
        let _products = users.filter((val) => !selectedProducts.includes(val));
        setUsers(_products);
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
            <h4 className="m-0">Tài khoản</h4>
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
        const table = { ...user };
        switch (field) {
            default: {
                table[field] = value;
            }
        }
        setUser(table);
    };

    const callbackFunction = (childData) => {
        const _image = { ...user }
        _image.image = childData
        setUser(_image)
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable
                        ref={dt}
                        value={users}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
                        globalFilter={globalFilter}
                        emptyMessage="No users found."
                        header={header}
                        loading={loading}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="name" header="Họ tên" body={(d) => <span >{`${d.firstName} ${d.lastName}`}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="email" header="Email" body={(d) => <span >{d.email}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="phone" header="Số điện thoại" body={(d) => <span >{d.phone}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="birthday" header="Ngày sinh" body={(d) => <span >{moment(d.dob).format('D-MM-YYYY')}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="gender" header="Giới tính" body={(d) => <span >{d.gender ? 'Nữ' : 'Nam'}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        {/* <Column header="Chức năng" body={(d) => actionBodyTemplate(d)} headerStyle={{ minWidth: '10rem' }}></Column> */}
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '600px' }} header={statusEdit ? "Sửa danh mục sản phẩm" : "Thêm mới danh mục sản phẩm"} modal className="p-fluid" onHide={hideDialog}>
                        <form >
                            <div className="field">
                                <label htmlFor="name">Tên danh mục</label>
                                <InputText
                                    value={user.name}
                                    onChange={(event) => setRowData(event.target.value, "name")}
                                    id="name" />
                            </div>
                            <div className="field ">
                                <label htmlFor="image">Ảnh danh mục</label>
                                <TemplateDemo parentCallback={callbackFunction}></TemplateDemo>
                                <Image hidden={!statusEdit} src={user?.image} alt="Image" width="100" />
                            </div>
                            <div className="field">
                                <label htmlFor="description">Mô tả</label>
                                <InputTextarea
                                    onChange={(event) => setRowData(event.target.value, "des")}
                                    value={user.des}
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
                            {user && (
                                <span>
                                    Are you sure you want to delete <b>{user.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {user && <span>Are you sure you want to delete the selected users?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );

}

export default UserPage