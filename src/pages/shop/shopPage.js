import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { addOrder, checkVoucher } from '../../api/order';
import { listProductByName } from '../../api/product';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { listVoucher } from '../../api/voucher';
import { useNavigate } from 'react-router-dom';
import { classNames } from 'primereact/utils';
const ShopPage = () => {
    let emptyProduct = {
        "id": null,
        "nameOfRecipient": null,
        "phoneNumber": null,
        "email": null,
        "paymentMethod": "COD",
        "note": null,
        "shipPrice": "0",
        "shopPriceTotal": "0",
        "discountPrice": null,
        "voucherCode": null,
        "discount": 0,
        "payed": true,
        "productOrderRequest": []
    }
    const [product, setProduct] = useState(null)
    const navigate = useNavigate();
    const [quantityProduct, setQuantityProduct] = useState(false)
    const [productSelected, setProductSelected] = useState([])
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [order, setOrder] = useState(emptyProduct);
    const [orderDelete, setOrderDelete] = useState(null)
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [vouchers, setVouchers] = useState(null);
    const [vouchersChecked, setVouchersChecked] = useState(false);
    const [loading, setLoading] = useState(true);
    const [checkRemoveOrder, setCheckRemoveOrder] = useState(null, null, null);
    const [error, setError] = useState({ field: "" });
    const toast = useRef(null);
    const dt = useRef(null);
    useEffect(() => {
        searchAll();
        getAll();
    }, []);

    const searchAll = () => {
    };
    const validate = () => {
        const _dataTable = { ...order };
        const _error = { ...error };
        if (!_dataTable.nameOfRecipient) {
            _error.field = 'nameOfRecipient';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập họ và tên', life: 1000 });
            setError(_error);
            return false;
        }
        if (!_dataTable.email) {
            _error.field = "email";
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập email', life: 1000 });
            setError(_error);
            return false;
        }
        if (!_dataTable.phoneNumber) {
            _error.field = "phoneNumber";
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập số điện thoại', life: 1000 });
            setError(_error);
            return false;
        }
        return true;
    }
    const onSubmit = (event) => {
        setLoading(true)
        event.preventDefault();
        const orderAdd = {
            ...order,
            productOrderRequest: productSelected.map((res) => {
                return {
                    id: res?.id,
                    qty: res?.quantity
                }
            })
        }
        if (!validate()) {
            setLoading(false);
            return;
        } else if (orderAdd.productOrderRequest.length == 0) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn sản phẩn muốn bán', life: 2000 });
            return;
        } else if (quantityProduct) {
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Số lượng đơn hàng không hợp lệ', life: 2000 });
            return;
        }
        setError({ field: '' });
        addOrder(orderAdd).then((res) => {
            if (res) {
                setLoading(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Thêm thành công', life: 3000 });
                navigate(`/orders/${res?.data.data}`)
            }

        })
    }

    const getAll = () => {
        listProductByName(
            {
                "search": "",
                "pageReq": {
                    "page": 0,
                    "pageSize": 100,
                    "sortField": "",
                    "sortDirection": ""
                }
            }
        ).then((res) => {
            const _data = res?.data.data.map((e) => {
                return {
                    ...e,
                    id: e.id,
                    productName: e.productName + '-' + e.sizeName + '-' + e.colorName,
                    productNameQTY: e.productName + '-' + e.sizeName + '-' + e.colorName + '-' + e.qty
                }
            })
            setProduct(_data);
        });
        listVoucher(
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
            const _data = res?.data.data
            setVouchers(_data);
        });
    }

    const hideDeleteProductDialog = () => {
        const index = checkRemoveOrder.rowIndex;
        const table = [...productSelected];
        const row = { ...table[index] };
        row["quantity"] = 1;
        table[index] = row;
        setProductSelected(table);
        setDeleteProductDialog(false);
    };

    const confirmDeleteProduct = (order) => {
        setOrderDelete(order);
        setDeleteProductDialog(true);
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-trash" severity="warning" disabled={vouchersChecked} rounded onClick={() => confirmDeleteProduct(rowData)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">Thêm đơn hàng</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <Dropdown
                    style={{ width: '300px' }}
                    value={product?.categoryId}
                    options={product}
                    placeholder='Chọn sản phẩm'
                    showClear
                    disabled={vouchersChecked}
                    filter
                    optionLabel="productNameQTY"
                    optionValue="id"
                    onChange={(event) => { setProductOrder(event.target.value) }}
                />
            </span>
        </div>
    );
    const deleteProduct = () => {
        const ids = orderDelete?.id
        const productDelete = productSelected.filter(({ id }) => id != ids)
        setProductSelected(productDelete)
        setDeleteProductDialog(false)
    };

    const deleteProductDialogFooter = (
        <>
            <Button label="Không" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Có" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );
    const setRowData = (value, field) => {
        const table = { ...order };
        switch (field) {
            case "voucherCode":
                if (value == null) {
                    table.voucherCode = null;
                    table.discountPrice = "0"
                } else {
                    table[field] = value?.voucherCode;
                    table.discountPrice = value?.voucherDiscount.toString()
                }
                break;
            default: {
                setError({ field: '' });
                table[field] = value;
            }
        }
        setOrder(table);
    };

    const setProductOrder = (value) => {
        const dataProduct = product?.find(({ id }) => id === value)
        const a = { ...dataProduct }
        a['quantity'] = 1
        const table = [...productSelected];
        const chechPriductExist = table.find(({ id }) => id === dataProduct.id)
        if (!chechPriductExist) {
            table.push(a)
        } else {
            chechPriductExist.quantity += a.quantity
        }
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
        <div className="grid crud-demo pt-2">
            <div className="col-9">
                <div className="card">
                    <Toast ref={toast} />
                    <DataTable
                        ref={dt}
                        value={productSelected}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
                        header={header}
                        //loading={loading}
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
                                disabled={vouchersChecked}
                                inputId="minmax-buttons"
                                value={d?.quantity}
                                onValueChange={(e) => {
                                    if (e.value === 0) {
                                        confirmDeleteProduct(d)
                                        setCheckRemoveOrder(index)
                                    } else {
                                        if (e.value > d.qty) {
                                            setQuantityProduct(true)
                                            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Số lượng đơn hàng không hợp lệ', life: 3000 });
                                        } else {
                                            setQuantityProduct(false)
                                        }
                                    }
                                    setRowProductOrder(e.value, 'quantity', index)
                                }}
                                mode="decimal"
                                showButtons min={0} max={100} />}
                        ></Column>
                        <Column field="price" header="Giá tiền" body={(d) => <span >{d.price}</span>} headerStyle={{ minWidth: '12rem' }}></Column>
                        <Column field="price" header="Thành tiền" body={(d) => <span >{d.price * d?.quantity}</span>} headerStyle={{ minWidth: '12rem' }}></Column>
                        <Column header="Chức năng" body={(d) => actionBodyTemplate(d)} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>


                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {order && (
                                <span>
                                    Bạn có chắc chắn muốn xóa sản phẩm ?
                                </span>
                            )}
                        </div>
                    </Dialog>
                </div>
            </div>
            <div className='col-3'>
                <form onSubmit={onSubmit} className="p-fluid">
                    <div className="field">
                        <label htmlFor="nameOfRecipient">Tên</label>
                        <InputText
                            value={order.nameOfRecipient}
                            className={classNames({
                                "p-invalid": error.field === 'nameOfRecipient'
                            })}
                            onChange={(event) => setRowData(event.target.value, "nameOfRecipient")}
                            id="nameOfRecipient" />
                    </div>
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <InputText
                            value={order.email}
                            className={classNames({
                                "p-invalid": error.field === 'email'
                            })}
                            onChange={(event) => setRowData(event.target.value, "email")}
                            id="email" />
                    </div>
                    <div className="field">
                        <label htmlFor="phoneNumber">Số điện thoại</label>
                        <InputText
                            keyfilter="num"
                            value={order.phoneNumber}
                            className={classNames({
                                "p-invalid": error.field === 'phoneNumber'
                            })}
                            onChange={(event) => setRowData(event.target.value, "phoneNumber")}
                            id="phoneNumber" />
                    </div>
                    <div className="field">
                        <label htmlFor="note">Ghi chú</label>
                        <InputText
                            value={order.note}
                            onChange={(event) => setRowData(event.target.value, "note")}
                            id="note" />
                    </div>
                    <div>Giá trị đơn hàng:{sumArray(productSelected.map((e) => e.price * e.quantity))?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</div>
                    <div className="field">
                        <label htmlFor="discount">Giảm giá</label>
                        <InputNumber
                            value={order.discount}
                            onChange={(event) => setRowData(event.value, "discount")}
                            id="discount" />
                    </div>
                    <div className="field">
                        <label htmlFor="voucherCode">Voucher</label>
                        <Dropdown
                            value={order?.voucherCode}
                            options={vouchers}
                            showClear
                            filter
                            optionLabel="code"
                            optionValue="code"
                            onChange={(event) => {
                                checkVoucher(
                                    {
                                        "voucherCode": event.target.value,
                                        "shopTotal": (sumArray(productSelected.map((e) => e.price * e.quantity)) - (order?.discountPrice ? order?.discountPrice : 0) - (order.discount ? order.discount : 0))
                                    }
                                ).then((res) => {
                                    const _data = res?.data.data;
                                    if (_data?.message === "Được phép sử dụng voucher !") {
                                        toast.current.show({ severity: 'success', summary: 'Thành công', detail: _data?.message, life: 1000 });
                                    } else {
                                        toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: _data?.message, life: 1000 });
                                    }
                                    if (_data?.message === "Được phép sử dụng voucher !") {
                                        setRowData(_data, "voucherCode")
                                        setVouchersChecked(true)
                                    } else {
                                        setRowData(null, "voucherCode")
                                        setVouchersChecked(false)
                                    }
                                });
                            }}
                        />
                    </div>
                    <div className="field">
                        <label >Số tiền giảm giá voucher</label>
                        <InputText
                            disabled
                            value={order.discountPrice}
                            on
                        />
                    </div>
                    <div>Tổng tiền:{(sumArray(productSelected.map((e) => e.price * e.quantity)) - (order?.discountPrice ? order?.discountPrice : 0) - (order.discount ? order.discount : 0))?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</div>
                    <br />
                    <div className='flex align-items-center justify-content-center'>
                        <Button label="Xuất đơn hàng" icon="pi pi-check" loading={false} />
                    </div>
                </form>
            </div>
        </div>
    );

}

export default ShopPage