import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { ToggleButton } from 'primereact/togglebutton';
import { Toolbar } from 'primereact/toolbar';
import { activeUser, addUser, listUser, removeCate } from '../../api/user';
import { RadioButton } from 'primereact/radiobutton';
import moment from 'moment';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
const UserPage = () => {
    let emptyProduct = {
        id: null,
        firstName: null,
        lastName: null,
        email: null,
        password: null,
        phone: null,
        role: "ROLE_CUSTOMER",
        gender: null,
        dob: null,
        active: null
    };
    const [users, setUsers] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [user, setUser] = useState(emptyProduct);
    const [errors, setErrors] = useState({ field: "" });
    const [statusEdit, setStatusEdit] = useState(false)
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checked, setChecked] = useState(false);
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
                    pageSize: 100,
                    sortField: "",
                    sortDirection: ""
                }
            }
        ).then((res) => {
            const _data = res?.data.data
            setUsers(_data);
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
        addUser(user).then((res) => {
            searchAll();
            setLoading(false);
            setProductDialog(false)
            toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Thêm thành công', life: 1000 });
        })
    }

    const openNew = () => {
        setUser(emptyProduct)
        setProductDialog(true);
    };

    const hideDialog = () => {
        setUser(emptyProduct)
        setErrors({ field: '' });
        setLoading(false);
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
        const ids = user.id
        removeCate(ids).then((res) => {
            if (res) {
                searchAll();
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
        const _dataTable = { ...user };
        const _error = { ...errors };
        if (!_dataTable.firstName) {
            _error.field = "firstName";
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập tên người dùng', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.lastName) {
            _error.field = 'lastName';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập Họ đệm người dùng', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.email) {
            _error.field = 'email';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập email', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.password) {
            _error.field = 'password';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập mật khẩu', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.phone) {
            _error.field = 'phone';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập số điện thoại', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.dob) {
            _error.field = 'dob';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập ngày sinh', life: 3000 });
            setErrors(_error);
            return false;
        }
        return true;
    }
    const setRowData = (value, field) => {
        const table = { ...user };
        switch (field) {
            default: {
                setErrors({ field: '' })
                table[field] = value;
            }
        }
        setUser(table);
    };
    const activeUserFunction = (e, id) => {
        activeUser(id?.id, e.value).then((res) => {
            if (res) {
                searchAll();
                setLoading(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Chuyển trạng thái thành công', life: 1000 });
            }
        })
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
                        <Column field="name" header="Họ tên" body={(d) => <span >{`${d.firstName} ${d.lastName}`}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="email" header="Email" body={(d) => <span >{d.email}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="phone" header="Số điện thoại" body={(d) => <span >{d.phone}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="birthday" header="Ngày sinh" body={(d) => <span >{moment(d.dob).format('D-MM-YYYY')}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="gender" header="Giới tính" body={(d) => <span >{d.gender ? 'Nữ' : 'Nam'}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column alignHeader={'center'} header="Hoạt động" body={(d) => <ToggleButton onLabel="Active" offLabel="Deactive" onIcon="pi pi-check" offIcon="pi pi-times"
                            checked={d?.active} onChange={(e) => activeUserFunction(e, d)} className="w-9rem" />} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '600px' }} header={statusEdit ? "Sửa tài khoản" : "Thêm mới tài khoản"} modal className="p-fluid" onHide={hideDialog}>
                        <form onSubmit={onSubmit} >
                            <div className="field">
                                <label htmlFor="firstName">Tên</label>
                                <InputText
                                    value={user.firstName}
                                    onChange={(event) => setRowData(event.target.value, "firstName")}
                                    className={classNames({ 'p-invalid': errors.field === 'firstName' })}
                                    id="firstName" />
                            </div>
                            <div className="field">
                                <label htmlFor="lastName">Họ</label>
                                <InputText
                                    value={user.lastName}
                                    onChange={(event) => setRowData(event.target.value, "lastName")}
                                    className={classNames({ 'p-invalid': errors.field === 'lastName' })}
                                    id="lastName" />
                            </div>
                            <div className="field">
                                <label htmlFor="email">Email</label>
                                <InputText
                                    value={user.email}
                                    onChange={(event) => setRowData(event.target.value, "email")}
                                    className={classNames({ 'p-invalid': errors.field === 'email' })}
                                    id="email" />
                            </div>
                            <div className="field">
                                <label htmlFor="password">Mật khẩu</label>
                                <InputText
                                    value={user.password}
                                    onChange={(event) => setRowData(event.target.value, "password")}
                                    className={classNames({ 'p-invalid': errors.field === 'password' })}
                                    id="password" />
                            </div>
                            <div className="field">
                                <label htmlFor="phone">Số điện thoại</label>
                                <InputText
                                    keyfilter='num'
                                    value={user.phone}
                                    onChange={(event) => setRowData(event.target.value, "phone")}
                                    className={classNames({ 'p-invalid': errors.field === 'phone' })}
                                    id="phone" />
                            </div>
                            <div className="grid formgrid p-fluid fluid mb-2">
                                <div className="col-12 flex gap-8 align-items-center">
                                    <div >
                                        <span className="">
                                            <RadioButton
                                                inputId="city1"
                                                name="city"
                                                onChange={() => setRowData(true, "gender")}
                                                checked={user?.gender === true}
                                                className={classNames({ 'p-invalid': errors.field === 'gender' })}
                                            />
                                            <label className='ml-2' htmlFor="city1">Nữ</label>
                                        </span>
                                    </div>
                                    <div >
                                        <span className="">
                                            <RadioButton
                                                inputId="city1"
                                                name="city"
                                                onChange={() => setRowData(false, "gender")}
                                                checked={user?.gender === false}
                                                className={classNames({ 'p-invalid': errors.field === 'gender' })}
                                            />
                                            <label className='ml-2' htmlFor="city1">Nam</label>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <label htmlFor="dob">Ngày sinh</label>
                                <Calendar
                                    value={user?.dob}
                                    onChange={(event) => setRowData(event.target.value, "dob")}
                                    className={classNames({ 'p-invalid': errors.field === 'dob' })}
                                    showIcon placeholder="dd/mm/yyyy" />
                            </div>
                            <div className='flex align-items-center justify-content-center'>
                                <Button label="Cancel" type='reset' icon="pi pi-times" text onClick={hideDialog} />
                                <Button label="Save" type='submit' icon="pi pi-check" loading={loading} />
                            </div>
                        </form>
                    </Dialog>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {user && (
                                <span>
                                    Bạn có chắc chắn muốn xóa tài khoản <b>{user.email}</b>?
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