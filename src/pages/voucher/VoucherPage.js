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
import { useForm } from 'react-hook-form';
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
            // const _paginator = { ...paginator };
            // _paginator.total = res.total;
            // setPaginator(_paginator);
            const _data = res?.data.data
            setVouchers(_data);
            setLoading(false);
        });
    };

    const onSubmit = () => {
        setLoading(true);
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
        setVoucher({ ...data });
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
            <h5 className="m-0">Mã giảm giá</h5>
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

        const table = { ...voucher };
        switch (field) {
            default: {
                table[field] = value;
            }
        }

        setVoucher(table);
    };

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
                        <Column field="amount" header="Gía tiền" sortable body={(d) => <span >{d?.amount?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="prerequisiteValue" header="Đơn giá tối thiểu" sortable body={(d) => <span >{d.prerequisiteValue?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="status" header="Trạng thái" sortable body={(d) => <span >{d.status}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column header="Chức năng" body={(d) => actionBodyTemplate(d)} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header={editVoucher ? "Sửa mẫ khuyến mãi" : "Thêm mới mã khuyến mãi"} modal className="p-fluid" onHide={hideDialog}>
                        <form >
                            <div className="field">
                                <label htmlFor="code">Mã giảm giá</label>
                                <InputText
                                    onChange={(event) => setRowData(event.target.value, "code")}
                                    value={voucher.code}
                                    id="code" />
                            </div>
                            <div className="field">
                                <label htmlFor="des">Mô tả</label>
                                <InputTextarea
                                    id="des"
                                    value={voucher.des}
                                    onChange={(event) => setRowData(event.target.value, "des")}
                                    rows={3} cols={20} />
                            </div>
                            <div className="field">
                                <label htmlFor="startDate">Từ ngày</label>
                                <Calendar
                                    value={moment(voucher?.startDate).format("YYYY-MM-DDTHH:mm:ssZZ")}
                                    onChange={(event) => setRowData(moment(event.target.value).format('YYYY-MM-DDTHH:mm:ssZZ'), "startDate")}
                                    showIcon />
                            </div>
                            <div className="field">
                                <label htmlFor="endDate">Đến ngày</label>
                                <Calendar
                                    value={moment(voucher?.endDate).format("YYYY-MM-DDTHH:mm:ssZZ")}
                                    onChange={(event) => setRowData(moment(event.target.value).format('YYYY-MM-DDTHH:mm:ssZZ'), "endDate")}
                                    showIcon />
                            </div>
                            <div className="field">
                                <label className="mb-3">Status</label>
                                <div className="formgrid grid">
                                    <div className="field-radiobutton col-6">
                                        <RadioButton inputId="pending" name="status" value="PENDING"
                                            onChange={(e) => setRowData(e.value, "status")}
                                            checked={voucher.status === 'PENDING'} />
                                        <label htmlFor="pending">PENDING</label>
                                    </div>
                                    <div className="field-radiobutton col-6">
                                        <RadioButton inputId="active" name="status" value="ACTIVE"
                                            onChange={(e) => setRowData(e.value, "status")}
                                            checked={voucher.status === 'ACTIVE'} />
                                        <label htmlFor="active">ACTIVE</label>
                                    </div>
                                    <div className="field-radiobutton col-6">
                                        <RadioButton inputId="inactive" name="status" value="INACTIVE"
                                            onChange={(e) => setRowData(e.value, "status")}
                                            checked={voucher.status === 'INACTIVE'} />
                                        <label htmlFor="inactive">INACTIVE</label>
                                    </div>
                                    <div className="field-radiobutton col-6">
                                        <RadioButton inputId="expired" name="status" value="EXPIRED"
                                            onChange={(e) => setRowData(e.value, "status")}
                                            checked={voucher.status === 'EXPIRED'} />
                                        <label htmlFor="expired">EXPIRED</label>
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <label htmlFor="percent">Phần trăm</label>
                                <InputNumber
                                    value={voucher.percent}
                                    onChange={(event) => setRowData(event.value, "percent")}
                                    suffix="%"
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="amount">Giá</label>
                                <InputNumber
                                    value={voucher.amount}
                                    onChange={(event) => setRowData(event.value, "amount")}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="prerequisiteValue">Đơn giá tối thiểu</label>
                                <InputNumber
                                    value={voucher.prerequisiteValue}
                                    onChange={(event) => setRowData(event.value, "prerequisiteValue")}
                                />
                            </div>
                            <div className='flex align-items-center justify-content-center'>
                                <Button label="Hủy" type='reset' icon="pi pi-times" text onClick={hideDialog} />
                                <Button label="Lưu" icon="pi pi-check" loading={loading} onClick={() => onSubmit()} />
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