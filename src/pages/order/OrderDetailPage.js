import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { changeStatus, listOneOrder } from '../../api/order';
import { useNavigate, useParams } from 'react-router-dom';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Timeline } from 'primereact/timeline';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';

const OrderDetailPage = () => {
    const [orders, setOrders] = useState(null);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [valueStatus, setValueStatus] = useState({ status: '', value: '' })
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [historyOrder, setHistoryOrder] = useState(false);
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
            const _data = res?.data.data
            setOrders(_data);
            setLoading(false);
        });
    };

    const onChange = () => {
        setLoading(true);
        changeStatus({
            "id": id,
            "status": valueStatus?.status,
            "note": ""
        }).then((res) => {
            if (res) {
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: `Đơn hàng đã chuyển trạng thái ${valueStatus?.value}`, life: 3000 });
                setDeleteProductDialog(false);
                setLoading(false);
            }
        });
    }
    const confirmDeleteProduct = (stt, val) => {
        setValueStatus({ status: stt, value: val })
        setDeleteProductDialog(true);
    };
    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };
    const deleteProductDialogFooter = (
        <>
            <Button label="Không" className="p-button-danger" icon="pi pi-times" text onClick={hideDeleteProductDialog} />
            <Button label="Có" className="p-button-success" icon="pi pi-check" text onClick={onChange} />
        </>
    );

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
                    <Accordion>
                        <AccordionTab header="Lịch sử đơn hàng">
                            <Timeline value={orders?.historyOrders} opposite={(item) => item.message} content={(item) => <small className="text-color-secondary">{item.date}</small>} />
                        </AccordionTab>
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
                    <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog} >
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>
                                {`Bạn có chắc chắn muốn ${valueStatus?.status == 'ACCEPT' ? 'duyệt' : valueStatus?.status == 'SHIPPING' ? 'giao' : valueStatus?.status == 'REJECT' ? 'hủy' : ''}  đơn ${orders?.orderCode} không ?`}
                            </span>
                        </div>
                    </Dialog>
                    <Dialog header="Lịch sử đơn hàng" visible={historyOrder} style={{ width: '500px' }} onHide={() => setHistoryOrder(false)}>
                        <div className="card">
                            <Timeline value={orders?.historyOrders} opposite={(item) => item.message} content={(item) => <small className="text-color-secondary">{item.date}</small>} />
                        </div>
                    </Dialog>
                    <Card className='flex justify-content-end' style={{ paddingRight: '300px' }}>
                        <p>Tổng chi phí đơn hàng: {orders?.shopTotal}</p>
                        <p>Voucher: {orders?.voucherCode}</p>
                        <p>Giảm giá voucher: {orders?.voucherDiscount}</p>
                        <p>Giảm giá: {orders?.discount}</p>
                        <p>Phí giao hàng: {orders?.shipPrice}</p>
                        <p className='font-bold'>Thanh toán: {orders?.total}</p>
                        <div className="flex flex-wrap gap-4">
                            <Button
                                style={{ display: orders?.status == 'REJECT' || orders?.status == 'CANCEL' || orders?.status == 'UNRECEIVED' || orders?.status == 'COMPLETE' ? 'none' : 'block' }}
                                onClick={() => {
                                    if (orders?.status == 'PENDING') {
                                        confirmDeleteProduct('ACCEPT', 'đã duyệt')
                                        //onChange('ACCEPT', 'đã duyệt')
                                    } else if (orders?.status == 'ACCEPT') {
                                        confirmDeleteProduct('SHIPPING', 'đã gửi hàng')
                                        //onChange('SHIPPING', 'đã gửi hàng')
                                    }
                                }}
                                severity="success" label={
                                    orders?.status == 'PENDING' ? 'Duyệt đơn' : orders?.status == 'ACCEPT' ? 'Giao hàng' : 'Đa'
                                } icon="pi pi-check" />
                            <Button
                                style={{ display: orders?.status == 'REJECT' || orders?.status == 'CANCEL' || orders?.status == 'UNRECEIVED' || orders?.status == 'COMPLETE' ? 'none' : 'block' }}
                                onClick={() => {
                                    if (orders?.status == 'PENDING' || orders?.status == 'ACCEPT') {
                                        confirmDeleteProduct('REJECT', 'đã hủy')
                                        // onChange('REJECT', 'đã hủy')
                                    }
                                    // else if (orders?.status == 'ACCEPT') {
                                    //     onChange('SHIPPING', 'đã gửi hàng')
                                    // }
                                }}
                                severity="danger" label="Hủy đơn" icon="pi pi-times"
                                className="p-button-outlined p-button-secondary" />
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

export default OrderDetailPage