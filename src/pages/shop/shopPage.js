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
import { addUser, listUser, removeCate, updateCate } from '../../api/user';
import { RadioButton } from 'primereact/radiobutton';
import moment from 'moment';
import { Calendar } from 'primereact/calendar';
import { listProduct, listProductByName } from '../../api/product';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
const ShopPage = () => {
    let emptyProduct = {
        id: null,
        firstName: null,
        lastName: null,
        email: null,
        password: null,
        phone: null,
        role: "ROLE_CUSTOMER",
        gender: null,
        dob: null
    };
    const [users, setUsers] = useState(null);
    const [product, setProduct] = useState(null)
    const [productSelected, setProductSelected] = useState([])
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [user, setUser] = useState(emptyProduct);
    const [statusEdit, setStatusEdit] = useState(false)
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [value3, setValue3] = useState(1);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);
    const dt = useRef(null);
    useEffect(() => {
        searchAll();
        getAll();
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
            addUser(user).then((res) => {
                searchAll();
                setLoading(false);
                setProductDialog(false)
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Thêm thành công', life: 1000 });
            })
        }

    }

    const getAll = () => {
        listProductByName(
            {
                "search": "",
                "pageReq": {
                    "page": 0,
                    "pageSize": 15,
                    "sortField": "",
                    "sortDirection": ""
                }
            }
        ).then((res) => {
            const _data = res?.data.data.map((e) => {
                return {
                    ...e,
                    id: e.id,
                    productName: e.productName + '-' + e.sizeName + '-' + e.colorName
                }
            })
            setProduct(_data);
        });
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
                <Dropdown
                    style={{ width: '300px' }}
                    value={product?.categoryId}
                    options={product}
                    showClear
                    filter
                    optionLabel="productName"
                    optionValue="id"
                    onChange={(event) => { setProductOrder(event.target.value) }}
                />
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

    const setProductOrder = (value) => {
        const dataProduct = product?.find(({ id }) => id === value)
        const a = { ...dataProduct }
        a['quantity'] = 1
        const table = [...productSelected];
        table.push(a)
        setProductSelected(table);
    };

    const setRowProductOrder = (value, field, rowIndex) => {
        const index = rowIndex.rowIndex;
        const table = [...productSelected];
        const row = { ...table[index] };

        switch (field) {
            default: {
                row[field] = value;
                table[index] = row;
            }
        }
        console.log(table);
        setProductSelected(table);
    };
    function sumArray(mang) {
        let sum = 0;
        let i = 0;
        while (i < mang.length) {
            sum += mang[i];
            i++;
        }
        return sum;
    }
    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <div className='flex justify-content-between mr-6'>
                        <DataTable
                            ref={dt}
                            value={productSelected}
                            selection={selectedProducts}
                            onSelectionChange={(e) => setSelectedProducts(e.value)}
                            dataKey="id"
                            className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
                            globalFilter={globalFilter}
                            emptyMessage="No users found."
                            header={header}
                            loading={loading}
                            responsiveLayout="scroll"
                        >
                            <Column field="productName" header="Tên sản phẩm" body={(d) => <span >{d.productName}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                            <Column field="colorName" header="Màu sắc" body={(d) => <span >{d.colorName}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column field="sizeName" header="Kích cỡ" body={(d) => <span >{d.sizeName}</span>} headerStyle={{ minWidth: '10rem' }}></Column>
                            <Column
                                headerStyle={{ minWidth: '10rem' }}
                                field="qty"
                                header="Số lượng"
                                body={(d, index) => <InputNumber
                                    inputId="minmax-buttons"
                                    value={value3}
                                    onValueChange={(e) => { setRowProductOrder(e.value, 'quantity', index) }}
                                    mode="decimal"
                                    showButtons min={0} max={100} />}
                            ></Column>
                            <Column field="price" header="Giá tiền" body={(d) => <span >{d.price}</span>} headerStyle={{ minWidth: '12rem' }}></Column>
                            <Column field="price" header="Thành tiền" body={(d) => <span >{d.price * d?.quantity}</span>} headerStyle={{ minWidth: '12rem' }}></Column>
                            {/* <Column header="Chức năng" body={(d) => actionBodyTemplate(d)} headerStyle={{ minWidth: '10rem' }}></Column> */}
                        </DataTable>
                        <form className="p-fluid">
                            <div className="field">
                                <label htmlFor="fullname">Tên</label>
                                <InputText
                                    value={user.fullname}
                                    onChange={(event) => setRowData(event.target.value, "fullname")}
                                    id="fullname" />
                            </div>
                            <div className="field">
                                <label htmlFor="email">Email</label>
                                <InputText
                                    value={user.email}
                                    onChange={(event) => setRowData(event.target.value, "email")}
                                    id="email" />
                            </div>
                            <div className="field">
                                <label htmlFor="phone">Số điện thoại</label>
                                <InputText
                                    value={user.phone}
                                    onChange={(event) => setRowData(event.target.value, "phone")}
                                    id="phone" />
                            </div>
                            <div>Gía trị đơn hàng:{sumArray(productSelected.map((e) => e.price * e.quantity))?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</div>
                            <div className='flex align-items-center justify-content-center'>
                                <Button label="Cancel" type='reset' icon="pi pi-times" text onClick={hideDialog} />
                                <Button label="Save" type='submit' icon="pi pi-check" loading={loading} onClick={() => onSubmit()} />
                            </div>
                        </form>
                    </div>

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

export default ShopPage