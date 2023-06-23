import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { changeStatus, listOneOrder } from '../../api/order';
import { useNavigate, useParams } from 'react-router-dom';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Card } from 'primereact/card';

const OrderDetailPage = () => {
    const [orders, setOrders] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);
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

    const onChange = (status, value) => {
        setLoading(true);
        changeStatus({
            "id": id,
            "status": status,
            "note": ""
        }).then((res) => {
            if (res) {
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: `Đơn hàng đã chuyển trạng thái ${value}`, life: 1000 });
                setLoading(false);
            }
        });
    }

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
                            <Button hidden={orders?.status != 'PENDING'} onClick={() => onChange('ACCEPT', 'đã duyệt')} severity="success" label="Duyệt đơn" icon="pi pi-check" />
                            <Button hidden={orders?.status != 'PENDING'} onClick={() => onChange('REJECT', 'đã hủy')} severity="danger" label="Hủy đơn" icon="pi pi-times" className="p-button-outlined p-button-secondary" />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default OrderDetailPage