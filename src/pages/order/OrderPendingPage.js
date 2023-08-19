import React, { useEffect, useRef, useState } from 'react'
import { TabView, TabPanel } from 'primereact/tabview';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { addOrder, removeOrder, updateOrder } from '../../api/order';
import { Image } from 'primereact/image';
import TemplateDemo from '../../component/FileUpload';
import { listOrder } from '../../api/order';
import moment from 'moment';
import { Tag } from 'primereact/tag';
import { useNavigate } from 'react-router-dom';
const OrderPendingPage = () => {
    const navigator = useNavigate();
    const [orders, setOrders] = useState(null);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [order, setOrder] = useState(null);
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
        listOrder(
            {
                status: "PENDING",
                orderCode: "",
                email: "",
                phoneNumber: "",
                payed: "",
                startDate: "",
                endDate: "",
                pageReq: {
                    page: 0,
                    pageSize: 100,
                    sortField: "createdDate",
                    sortDirection: "desc"
                }
            }
        ).then((res) => {
            const _data = res?.data.data
            setOrders(_data);
            setLoading(false);
        });
    };

    const onSubmit = () => {


    }

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };


    const deleteProduct = () => {
        const ids = order
        removeOrder(ids).then((res) => {
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


    const deleteSelectedProducts = () => {
        let _products = orders.filter((val) => !selectedProducts.includes(val));
        setOrders(_products);
        setDeleteProductsDialog(false);
        setSelectedProducts(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-eye" severity="secondary" rounded className="mr-2" onClick={() => navigator(`/orders/pending/${rowData?.orderId}`)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h4 className="m-0">Đơn hàng chờ xác nhận</h4>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Tìm kiếm" />
            </span>
            <React.Fragment>
                <Button label="Xuất" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
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

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />

                    <DataTable
                        ref={dt}
                        value={orders}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
                        globalFilter={globalFilter}
                        emptyMessage="No orders found."
                        header={header}
                        loading={loading}
                        responsiveLayout="scroll"
                    >
                        <Column field="code" header="Mã đơn hàng" sortable body={(d) => <span >{d.orderCode}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="createdDate" header="Ngày đặt" sortable body={(d) => <span >{moment(d.createdDate).format('D-MM-YYYY HH:mm:ss')}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="payed" header="Trạng thái thanh toán" body={(d) => <span >{d.payed ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="total" header="Thành tiền" body={(d) => <span >{d?.total?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="paymentMethod" header="Phương thức thành toán" body={(d) => <span >{d.paymentMethod}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="status" header="Trạng thái đơn hàng" align={'center'} body={(d) => <Tag className="mr-2" severity={d.status == 'PENDING' ? 'warning' : d.status == 'RECEIVED' ? 'Success' : ''} value={d.statusValue}></Tag>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column header="Chức năng" body={(d) => actionBodyTemplate(d)} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {order && (
                                <span>
                                    Are you sure you want to delete <b>{order.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {order && <span>Are you sure you want to delete the selected orders?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );

}

export default OrderPendingPage