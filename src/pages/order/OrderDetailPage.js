import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { FileUpload } from 'primereact/fileupload';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { listOneOrder } from '../../api/order';
import moment from 'moment';
import { Tag } from 'primereact/tag';
import { useNavigate, useParams } from 'react-router-dom';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Card } from 'primereact/card';

const OrderDetailPage = () => {
    const [orders, setOrders] = useState(null);
    const [order, setOrder] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);
    const navigator = useNavigate();
    const dt = useRef(null);
    const { id } = useParams();
    useEffect(() => {
        searchAll();
    }, []);

    const searchAll = () => {
        setLoading(true);
        listOneOrder(id).then((res) => {
            // const _paginator = { ...paginator };
            // _paginator.total = res.total;
            // setPaginator(_paginator);
            const _data = res?.data.data
            setOrders(_data);
            setLoading(false);
        });
    };

    const exportCSV = () => {
        dt.current.exportCSV();
    };


    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    const header = (
        <>
            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <h4 className="m-0">Chi tiết đơn hàng</h4>
            </div>

        </>
    );
    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Button className='m-3' label="Quay lại" icon="pi pi-arrow-circle-left" onClick={() => navigator(`/orders`)} />
                    <Toast ref={toast} />
                    <Card title="Chi tiết đơn hàng">
                        <p className='font-bold'>Mã đơn hàng: {orders?.orderCode}</p>
                        <p>Trạng thái đơn hàng: {orders?.statusValue}</p>
                        <p>Trạng thái thanh toán: {orders?.payed === true ? 'Đã thanh toán' : 'Chưa thanh toán'}</p>
                    </Card>
                    <Accordion activeIndex={0}>
                        <AccordionTab header="Thông tin người nhận">
                            <p>Tên người nhận: {orders?.customerInfo.nameOfRecipient}</p>
                            <p>Email: {orders?.email}</p>
                            <p>Số điện thoại: {orders?.phoneNumber}</p>
                            <p>Tỉnh/Thành phố: {orders?.customerInfo.provinceName} </p>
                            <p>Quận/Huyện: {orders?.customerInfo.districtName} </p>
                            <p>Phường/Xã: {orders?.customerInfo.wardName} </p>
                            <p>Địa chỉ chi tiết: {orders?.customerInfo.addressDetail}</p>
                        </AccordionTab>
                    </Accordion>
                    <DataTable
                        ref={dt}
                        value={orders?.orderDetails}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} orders"
                        globalFilter={globalFilter}
                        emptyMessage="No orders found."
                        header={header}
                        loading={loading}
                        responsiveLayout="scroll"
                    >
                        <Column field="name" header="Tên sản phẩm" sortable body={(d) => <span >{d.name}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="qty" header="Số lượng" sortable body={(d) => <span >{d.qty}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="price" header="Giá" body={(d) => <span >{d.price?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="color/size" header="Màu sắc/Kích cỡ" body={(d) => <span >{d?.color}/{d?.size}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="total" header="Thành tiền" body={(d) => <span >{d.total?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                    </DataTable>
                    <Card className='flex justify-content-end' style={{ paddingRight: '300px' }}>
                        <p >Tổng chi phí đơn hàng: {orders?.shopTotal}</p>
                        <p>Voucher: {orders?.voucherCode}</p>
                        <p>Giảm giá voucher: {orders?.voucherDiscount}</p>
                        <p>Giảm giá: {orders?.discount}</p>
                        <p>Phí giao hàng: {orders?.shipPrice}</p>
                        <p className='font-bold'>Thanh toán: {orders?.total}</p>
                        <div className="flex flex-wrap gap-4">
                            <Button severity="success" label="Duyệt đơn" icon="pi pi-check" />
                            <Button severity="danger" label="Hủy đơn" icon="pi pi-times" className="p-button-outlined p-button-secondary" />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );

}

export default OrderDetailPage