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
import { InputNumber } from 'primereact/inputnumber';
import { RadioButton } from 'primereact/radiobutton';
import { Calendar } from 'primereact/calendar';
import { addVoucher, listVoucher, removeVoucher, updateVoucher } from '../../api/voucher';
import { InputTextarea } from 'primereact/inputtextarea';
import moment from 'moment/moment';
const VoucherPage = () => {
    let emptyProduct = {
        id: "",
        des: null,
        code: null,
        startDate: null,
        endDate: null,
        prerequisiteValue: null,
        status: null,
        percent: null,
        amount: null
    };
    const [vouchers, setVouchers] = useState(null);
    const [errors, setErrors] = useState({ field: "" });
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [voucher, setVoucher] = useState(emptyProduct);
    const [editVoucher, setEditVoucher] = useState(false)
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
        if (editVoucher) {
            updateVoucher(voucher).then((res) => {
                if (res) {
                    searchAll();
                    setLoading(false);
                    setVoucher(emptyProduct);
                    setEditVoucher(false)
                    setProductDialog(false)
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sửa thành công', life: 1000 });
                }

            })
        } else {
            addVoucher(voucher).then((res) => {
                if (res) {
                    searchAll();
                    setLoading(false);
                    setVoucher(emptyProduct);
                    setProductDialog(false)
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Thêm thành công', life: 1000 });
                }
            })
        }
    }

    const openNew = () => {
        setVoucher(emptyProduct)
        setProductDialog(true);
    };

    const hideDialog = () => {
        setVoucher(emptyProduct);
        setLoading(false)
        setErrors({ field: '' });
        setProductDialog(false);
        setEditVoucher(false)
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const editProduct = (data) => {
        setEditVoucher(true);
        setVoucher({
            ...data,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate)
        });
        setProductDialog(true);
    };


    const confirmDeleteProduct = (voucher) => {
        setVoucher(voucher);
        setDeleteProductDialog(true);
    };
    const deleteProduct = () => {
        const ids = voucher?.id
        removeVoucher(ids).then((res) => {
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
        let _products = vouchers.filter((val) => !selectedProducts.includes(val));
        setVouchers(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" severity="sucess" className="mr-2" onClick={openNew} />
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
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
            <h4 className="m-0">Mã giảm giá</h4>
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
        const _dataTable = { ...voucher };
        const _error = { ...errors };
        if (!_dataTable.code) {
            _error.field = "code";
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập mã giảm giá', life: 3000 });
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
        if (!_dataTable.startDate) {
            _error.field = 'startDate';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập từ ngày', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.endDate) {
            _error.field = 'endDate';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập đến ngày', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (_dataTable.startDate && _dataTable.endDate && _dataTable.startDate > _dataTable.endDate) {
            _error.field = 'date';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Đến ngày không được nhỏ hơn từ ngày', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.status) {
            _error.field = 'status';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng chọn trạng thái', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.percent) {
            _error.field = 'percent';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập phần trăm', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.amount) {
            _error.field = 'amount';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập số lượng', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.prerequisiteValue) {
            _error.field = 'prerequisiteValue';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập đơn giá tôi thiểu', life: 3000 });
            setErrors(_error);
            return false;
        }
        return true;
    }
    const setRowData = (value, field) => {
        const table = { ...voucher };
        const _error = { ...errors };
        switch (field) {
            case "code":
                setErrors({ field: '' });
                table[field] = value;
                break;
            case "des":
                setErrors({ field: '' });
                table[field] = value;
                break;
            case "startDate":
                setErrors({ field: '' });
                table[field] = value;
                break;
            case "endDate":
                if (!value) {
                    table[field] = null
                } else {
                    setErrors({ field: '' });
                    table[field] = value;
                }
                if (table.startDate && table.endDate) {
                    if (table.endDate < table.startDate) {
                        _error.field = 'date';
                        toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Đến ngày không được nhỏ hơn từ ngày', life: 3000 });
                        setErrors(_error);
                    } else {
                        setErrors({ field: '' });
                    }
                }
                break;
            case "status":
                setErrors({ field: '' });
                table[field] = value;
                break;
            case "percent":
                setErrors({ field: '' });
                table[field] = value;
                break;
            case "amount":
                setErrors({ field: '' });
                table[field] = value;
                break;
            case "prerequisiteValue":
                setErrors({ field: '' });
                table[field] = value;
                break;
            default: {
                table[field] = value;
                break;
            }
        }
        setVoucher(table);
    };
    console.log(errors);
    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <DataTable
                        ref={dt}
                        value={vouchers}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} vouchers"
                        globalFilter={globalFilter}
                        emptyMessage="No vouchers found."
                        header={header}
                        loading={loading}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="code" header="Mã giảm giá" sortable body={(d) => <span >{d.code}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="des" header="Mô tả" sortable body={(d) => <span >{d.des}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="startDate" header="Từ ngày" sortable body={(d) => <span >{moment(d.startDate).format('D-MM-YYYY')}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="endDate" header="Đến ngày" sortable body={(d) => <span >{moment(d.endDate).format('D-MM-YYYY')}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="percent" header="Phần trăm" sortable body={(d) => <span >{d.percent}%</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="amount" header="Số lượng" sortable body={(d) => <span >{d?.amount}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="prerequisiteValue" header="Đơn giá tối thiểu" sortable body={(d) => <span >{d.prerequisiteValue?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="status" header="Trạng thái" sortable body={(d) => <span >{d.status}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column header="Chức năng" body={(d) => actionBodyTemplate(d)} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header={editVoucher ? "Sửa mẫ khuyến mãi" : "Thêm mới mã khuyến mãi"} modal className="p-fluid" onHide={hideDialog}>
                        <form onSubmit={onSubmit} >
                            <div className="field">
                                <label htmlFor="code">Mã giảm giá</label>
                                <InputText
                                    onChange={(event) => setRowData(event.target.value, "code")}
                                    value={voucher.code}
                                    id="code"
                                    className={classNames({ 'p-invalid': errors.field === 'code' })}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="des">Mô tả</label>
                                <InputTextarea
                                    id="des"
                                    minLength={20}
                                    value={voucher.des}
                                    onChange={(event) => setRowData(event.target.value, "des")}
                                    rows={3} cols={20}
                                    className={classNames({ 'p-invalid': errors.field === 'des' })}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="startDate">Từ ngày</label>
                                <Calendar
                                    value={voucher?.startDate}
                                    onChange={(event) => setRowData(event.value, "startDate")}
                                    showIcon
                                    placeholder="dd/mm/yyyy"
                                    className={classNames({ 'p-invalid': errors.field === 'startDate' || errors.field === 'date' })}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="endDate">Đến ngày</label>
                                <Calendar
                                    value={voucher?.endDate}
                                    onChange={(event) => setRowData(event.value, "endDate")}
                                    showIcon
                                    placeholder="dd/mm/yyyy"
                                    className={classNames({ 'p-invalid': errors.field === 'endDate' || errors.field === 'date' })}
                                />
                            </div>
                            <div className="field">
                                <label className="mb-3">Trạng thái</label>
                                <div className="formgrid grid">
                                    <div className="field-radiobutton col-6">
                                        <RadioButton inputId="pending" name="status" value="PENDING"
                                            onChange={(e) => setRowData(e.value, "status")}
                                            checked={voucher.status === 'PENDING'}
                                            className={classNames({ 'p-invalid': errors.field === 'status' })}
                                        />
                                        <label htmlFor="pending">PENDING</label>
                                    </div>
                                    <div className="field-radiobutton col-6">
                                        <RadioButton inputId="active" name="status" value="ACTIVE"
                                            onChange={(e) => setRowData(e.value, "status")}
                                            checked={voucher.status === 'ACTIVE'}
                                            className={classNames({ 'p-invalid': errors.field === 'status' })}
                                        />
                                        <label htmlFor="active">ACTIVE</label>
                                    </div>
                                    <div className="field-radiobutton col-6">
                                        <RadioButton inputId="inactive" name="status" value="INACTIVE"
                                            onChange={(e) => setRowData(e.value, "status")}
                                            checked={voucher.status === 'INACTIVE'}
                                            className={classNames({ 'p-invalid': errors.field === 'status' })}
                                        />
                                        <label htmlFor="inactive">INACTIVE</label>
                                    </div>
                                    <div className="field-radiobutton col-6">
                                        <RadioButton inputId="expired" name="status" value="EXPIRED"
                                            onChange={(e) => setRowData(e.value, "status")}
                                            checked={voucher.status === 'EXPIRED'}
                                            className={classNames({ 'p-invalid': errors.field === 'status' })}
                                        />
                                        <label htmlFor="expired">EXPIRED</label>
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <label htmlFor="percent">Phần trăm</label>
                                <InputNumber
                                    value={voucher.percent}
                                    min={0}
                                    max={100}
                                    onChange={(event) => setRowData(event.value, "percent")}
                                    suffix="%"
                                    className={classNames({ 'p-invalid': errors.field === 'percent' })}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="amount">Số lượng</label>
                                <InputNumber
                                    value={voucher.amount}
                                    onChange={(event) => setRowData(event.value, "amount")}
                                    className={classNames({ 'p-invalid': errors.field === 'amount' })}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="prerequisiteValue">Đơn giá tối thiểu</label>
                                <InputNumber
                                    value={voucher.prerequisiteValue}
                                    onChange={(event) => setRowData(event.value, "prerequisiteValue")}
                                    className={classNames({ 'p-invalid': errors.field === 'prerequisiteValue' })}
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
                            {voucher && (
                                <span>
                                    Bạn có chắc chắn muốn xóa <b>{voucher.code}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {voucher && <span>Are you sure you want to delete the selected vouchers?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );

}

export default VoucherPage