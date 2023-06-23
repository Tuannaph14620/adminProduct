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
    const [productSelected, setProductSelected] = useState([])
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [order, setOrder] = useState(emptyProduct);
    const [orderDelete, setOrderDelete] = useState(null)
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [vouchers, setVouchers] = useState(null);
    const [loading, setLoading] = useState(true);
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
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn sản phẩn muốn bán', life: 1000 });
            return;
        }
        setError({ field: '' });
        addOrder(orderAdd).then((res) => {
            if (res) {
                setLoading(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Thêm thành công', life: 1000 });
                navigate('/orders')
            }

        })
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
        listVoucher(
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
            const _data = res?.data.data
            setVouchers(_data);
        });
    }
    const checkVouchers = (voucher, total) => {
        checkVoucher(
            {
                "voucherCode": voucher,
                "shopTotal": total
            }
        ).then((res) => {
            const _data = res?.data.data
            toast.current.show({ severity: 'success', summary: 'Successful', detail: _data?.message, life: 1000 });
            return _data
        });
    }

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const confirmDeleteProduct = (order) => {
        setOrderDelete(order);
        setDeleteProductDialog(true);
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
            <h4 className="m-0">Thêm đơn hàng</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <Dropdown
                    style={{ width: '300px' }}
                    value={product?.categoryId}
                    options={product}
                    placeholder='Chọn sản phẩm'
                    showClear
                    filter
                    optionLabel="productName"
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
            <Button label="No" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" text onClick={deleteProduct} />
        </>
    );
    const setRowData = (value, field) => {
        const table = { ...order };
        switch (field) {
            case "voucherCode":
                table[field] = value;
                if (table[field] == null) {
                    table.discountPrice = "0"
                } else {
                    table.discountPrice = vouchers?.find(({ code }) => code === value)?.prerequisiteValue.toString()
                }

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

    const setRowProductOrder = (value, field, rowIndex, product) => {
        const index = rowIndex.rowIndex;
        const table = [...productSelected];
        const row = { ...table[index] };

        switch (field) {
            default: {
                if (value == 0) {
                    confirmDeleteProduct(product)
                } else {
                    row[field] = value;
                    table[index] = row;
                }
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
                                inputId="minmax-buttons"
                                value={d?.quantity}
                                onValueChange={(e) => { setRowProductOrder(e.value, 'quantity', index, d) }}
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
                                const a = checkVouchers(event.target.value, (sumArray(productSelected.map((e) => e.price * e.quantity)) - (order?.discountPrice ? order?.discountPrice : 0) - (order.discount ? order.discount : 0)))
                                if (a) {
                                    setRowData(event.target.value, a?.voucherDiscount)
                                }
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