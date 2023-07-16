import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { changeInfoCustomer, changeStatus, listOneOrder } from '../../api/order';
import { useNavigate, useParams } from 'react-router-dom';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { listDistrict, listProvince, listWard } from '../../api/ghn';
import { Dropdown } from 'primereact/dropdown';
import { Timeline } from 'primereact/timeline';

const OrderDetailPendingPage = () => {
    const [orders, setOrders] = useState(null);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [cancelCustomInfo, setCancelCustomInfo] = useState(false);
    const [infoCustomer, setInfoCustomer] = useState({});
    const [infoCustomerOriginal, setInfoCustomerOriginal] = useState({});
    const [province, setProvince] = useState(null);
    const [district, setDistrict] = useState(null);
    const [historyOrder, setHistoryOrder] = useState(false);
    const [ward, setWard] = useState(null);
    const [valueStatus, setValueStatus] = useState({ status: '', value: '' })
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [changeAddress, setChangeAddress] = useState(true);
    const [onTouch, setOnTouch] = useState(true);
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
            setInfoCustomer(_data?.customerInfo)
            setInfoCustomerOriginal(_data?.customerInfo)
            listDistrict(_data?.customerInfo?.provinceId).then((res) => {
                const _data = res?.data.data
                setDistrict(_data);
            });
            listWard(_data?.customerInfo?.districtId).then((res) => {
                const _data = res?.data.data
                setWard(_data);
            });
            setLoading(false);
        });
        listProvince(id).then((res) => {
            const _data = res?.data.data
            setProvince(_data);
        });


    };
    const onSubmit = () => {
        setLoading(true);
        changeInfoCustomer(infoCustomer).then((res) => {
            if (res) {
                searchAll();
                setLoading(false);
                setChangeAddress(true)
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sửa thành công', life: 3000 });
            }
        })
    }
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
    const resetInfoCustomer = () => {
        setCancelCustomInfo(false);
        setChangeAddress(true);
        setOnTouch(true);
        setInfoCustomer(infoCustomerOriginal)
    }
    const confirmCancelCustomInfo = () => {
        if (!onTouch) {
            setCancelCustomInfo(true);
        }
    };
    const hideConfirmCancelCustomInfo = () => {
        setCancelCustomInfo(false);
    };
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

    const confirmCancelCustomInfoFooter = (
        <>
            <Button label="Không" className="p-button-danger" icon="pi pi-times" text onClick={hideConfirmCancelCustomInfo} />
            <Button label="Có" className="p-button-success" icon="pi pi-check" text onClick={resetInfoCustomer} />
        </>
    );

    const header = (
        <>
            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <h4 className="m-0">Chi tiết đơn hàng</h4>
            </div>

        </>
    );
    const setRowData = (value, field) => {
        setOnTouch(false)
        const table = { ...infoCustomer };
        switch (field) {
            case "provinceId":
                table[field] = value.toString();
                const proEdit = province?.find(({ ProvinceID }) => ProvinceID === value)
                table["provinceName"] = proEdit?.ProvinceName
                table["districtId"] = null
                table["wardCode"] = null
                listDistrict(value).then((res) => {
                    const _data = res?.data.data
                    setDistrict(_data);
                });
                break;
            case "districtId":
                table[field] = value.toString();
                const disEdit = district?.find(({ DistrictID }) => DistrictID === value)
                table["districtName"] = disEdit?.DistrictName
                listWard(value).then((res) => {
                    const _data = res?.data.data
                    setWard(_data);
                });
                break;
            case "wardCode":
                table[field] = value;
                const wardEdit = ward?.find(({ WardCode }) => WardCode === value)
                table["wardName"] = wardEdit?.WardName
                break;
            default: {
                table[field] = value;
            }
        }
        setInfoCustomer(table);
    };
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
                            <div className='grid crud-demo pt-2'>
                                <div className='col-12'>
                                    <Button style={{ display: changeAddress ? 'block' : 'none' }} className='mb-3' label="Sửa thông tin " onClick={() => setChangeAddress(false)} />
                                    <Button disabled={onTouch} style={{ display: changeAddress ? 'none' : 'block' }} className='mb-3' label="Hủy" onClick={() => confirmCancelCustomInfo()} />
                                    <div className="p-fluid">
                                        <div className="field">
                                            <label htmlFor="name">Tên khách hàng: {changeAddress ? infoCustomer?.nameOfRecipient : ''}</label>
                                            <InputText
                                                style={{ display: changeAddress ? 'none' : 'block' }}
                                                disabled={changeAddress}
                                                value={infoCustomer?.nameOfRecipient}
                                                onChange={(event) => setRowData(event.target.value, "nameOfRecipient")}
                                                id="name" />
                                        </div>
                                        <div className="field">
                                            <label htmlFor="email">Email: {changeAddress ? infoCustomer?.email : ''}</label>
                                            <InputText
                                                style={{ display: changeAddress ? 'none' : 'block' }}
                                                disabled={changeAddress}
                                                value={infoCustomer?.email}
                                                onChange={(event) => setRowData(event.target.value, "email")}
                                                id="email" />
                                        </div>
                                        <div className="field">
                                            <label htmlFor="phone">Phone: {changeAddress ? infoCustomer?.phoneNumber : ''}</label>
                                            <InputText
                                                style={{ display: changeAddress ? 'none' : 'block' }}
                                                disabled={changeAddress}
                                                value={infoCustomer?.phoneNumber}
                                                onChange={(event) => setRowData(event.target.value, "phoneNumber")}
                                                id="phone" />
                                        </div>
                                        <div className="field">
                                            <label htmlFor="province">Tỉnh/ Thành phố: {changeAddress ? infoCustomer?.provinceName : ''}</label>
                                            <Dropdown
                                                style={{ display: changeAddress ? 'none' : '' }}
                                                disabled={changeAddress}
                                                value={infoCustomer?.provinceId ? parseInt(infoCustomer?.provinceId) : ''}
                                                filter
                                                showClear
                                                options={province}
                                                optionLabel="ProvinceName"
                                                optionValue="ProvinceID"
                                                onChange={(event) => setRowData(event.target.value, "provinceId")}
                                            ></Dropdown>
                                        </div>
                                        <div className="field">
                                            <label htmlFor="province">Quận/ Huyện: {changeAddress ? infoCustomer?.districtName : ''}</label>
                                            <Dropdown
                                                style={{ display: changeAddress ? 'none' : '' }}
                                                disabled={changeAddress}
                                                value={infoCustomer?.districtId ? parseInt(infoCustomer?.districtId) : null}
                                                filter
                                                showClear
                                                options={district}
                                                optionLabel="DistrictName"
                                                optionValue="DistrictID"
                                                onChange={(event) => setRowData(event.target.value, "districtId")}
                                            ></Dropdown>
                                        </div>
                                        <div className="field">
                                            <label htmlFor="province">Phường/ Xã: {changeAddress ? infoCustomer?.wardName : ''}</label>
                                            <Dropdown
                                                style={{ display: changeAddress ? 'none' : '' }}
                                                disabled={changeAddress}
                                                value={infoCustomer?.wardCode}
                                                filter
                                                hidden
                                                showClear
                                                options={ward}
                                                optionLabel="WardName"
                                                optionValue="WardCode"
                                                onChange={(event) => setRowData(event.target.value, "wardCode")}
                                            ></Dropdown>
                                        </div>
                                        <div className="field">
                                            <label htmlFor="addressDetail">Mô tả : {changeAddress ? infoCustomer?.addressDetail : ''}</label>
                                            <InputTextarea
                                                style={{ display: changeAddress ? 'none' : 'block' }}
                                                disabled={changeAddress}
                                                onChange={(event) => setRowData(event.target.value, "addressDetail")}
                                                value={infoCustomer?.addressDetail}
                                                id="addressDetail"
                                                rows={3} cols={20} />
                                        </div>
                                        <div className='flex align-items-center justify-content-center'>
                                            <Button style={{ display: changeAddress ? 'none' : 'block' }} label="Save" type='submit' icon="pi pi-check" loading={loading} onClick={() => onSubmit()} />
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                    <Dialog visible={cancelCustomInfo} style={{ width: '450px' }} header="Confirm" modal footer={confirmCancelCustomInfoFooter} onHide={hideConfirmCancelCustomInfo} >
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            <span>
                                {`Bạn có chắc chắn không muốn thay đổi thông tin ?`}
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

export default OrderDetailPendingPage