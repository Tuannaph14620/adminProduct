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
import { feeShip, listDistrict, listProvince, listWard, methodShip } from '../../api/ghn';
import { Dropdown } from 'primereact/dropdown';
import { Timeline } from 'primereact/timeline';
import { classNames } from 'primereact/utils';

const OrderDetailPendingPage = () => {
    const [orders, setOrders] = useState(null);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [errors, setErrors] = useState({ field: "" });
    const [cancelCustomInfo, setCancelCustomInfo] = useState(false);
    const [infoCustomer, setInfoCustomer] = useState({});
    const [infoCustomerOriginal, setInfoCustomerOriginal] = useState({});
    const [province, setProvince] = useState(null);
    const [district, setDistrict] = useState(null);
    const [historyOrder, setHistoryOrder] = useState(false);
    const [ward, setWard] = useState(null);
    const [serviceId, setServiceId] = useState(null);
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
            methodShip(_data?.customerInfo?.districtId).then((res) => {
                const _data = res?.data.data
                setServiceId(_data)
            })
            setLoading(false);
        });
        listProvince(id).then((res) => {
            const _data = res?.data.data
            setProvince(_data);
        });


    };
    const onSubmit = async () => {
        setLoading(true);
        if (!validate()) {
            setLoading(false);
            return;
        }
        setErrors({ field: '' })

        if (infoCustomer?.shipServiceId == '100039') {
            setLoading(false);
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Phương thức vận chuyển không phù hợp, vui lòng chọn lại!', life: 3000 });
            return

        }
        changeInfoCustomer({ ...infoCustomer, shipPrice: orders?.shipPrice }).then((res) => {
            if (res) {
                searchAll();
                setLoading(false);
                setChangeAddress(true)
                toast.current.show({ severity: 'success', summary: 'Thành công', detail: 'Sửa thành công', life: 3000 });
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
        setErrors({ field: '' })
    }
    const confirmCancelCustomInfo = () => {
        setCancelCustomInfo(true);
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

    const validate = () => {
        const _dataTable = { ...infoCustomer };
        const _error = { ...errors };
        if (!_dataTable.nameOfRecipient) {
            _error.field = 'nameOfRecipient';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập tên khách hàng', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.email) {
            _error.field = "email";
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập email khách hàng', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.phoneNumber) {
            _error.field = "phoneNumber";
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập số điện thoại khách hàng', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.provinceId) {
            _error.field = "provinceId";
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập Tỉnh/Thành phố', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.districtId) {
            _error.field = "districtId";
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập Quận/Huyện', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.wardCode) {
            _error.field = "wardCode";
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập Phường/Xã', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.address) {
            _error.field = "address";
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập mô tả địa chỉ', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.shipServiceId) {
            _error.field = "shipServiceId";
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập loại hình vận chuyển', life: 3000 });
            setErrors(_error);
            return false;
        }
        return true;
    }

    const setRowData = async (value, field) => {
        setOnTouch(false)
        const table = { ...infoCustomer };
        switch (field) {
            case "provinceId":
                table[field] = value?.toString();
                const proEdit = province?.find(({ ProvinceID }) => ProvinceID === value)
                table["provinceName"] = proEdit?.ProvinceName
                table["districtId"] = null
                table["wardCode"] = null
                if (value) {
                    listDistrict(value).then((res) => {
                        const _data = res?.data.data
                        setDistrict(_data);
                    });
                } else {
                    setDistrict(null)
                }

                break;
            case "districtId":
                table[field] = value?.toString();
                const disEdit = district?.find(({ DistrictID }) => DistrictID === value)
                table["districtName"] = disEdit?.DistrictName
                if (value) {
                    listWard(value).then((res) => {
                        const _data = res?.data.data
                        setWard(_data);
                    });
                    methodShip(value).then((res) => {
                        const _data = res?.data.data
                        setServiceId(_data);
                    })
                } else {
                    setWard(null);
                }

                break;
            case "wardCode":
                table[field] = value;
                const wardEdit = ward?.find(({ WardCode }) => WardCode === value)
                table["wardName"] = wardEdit?.WardName
                break;

            case "shipServiceId":
                table[field] = value ? value?.toString() : null;
                const serviceList = serviceId?.find(({ service_id }) => service_id === value)
                table["shipServiceName"] = serviceList?.short_name
                const param = {
                    "service_id": value,
                    "insurance_value": orders.total,
                    "coupon": null,
                    "from_district_id": 3440,
                    "to_district_id": infoCustomer.districtId,
                    "to_ward_code": infoCustomer.wardCode,
                    "height": orders.height,
                    "length": orders.length,
                    "weight": orders.weight,
                    "width": orders.width,
                }
                if (value) {
                    try {
                        await feeShip(param).then((res) => {
                            if (res) {

                            }
                        })
                    } catch (error) {
                        setChangeAddress(false)
                        toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Phương thức vận chuyển không phù hợp, vui lòng chọn lại!', life: 3000 });
                    }
                }

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
                                    <Button style={{ display: orders?.paymentMethod === 'VNPAY' ? 'none' : changeAddress ? 'block' : 'none' }} className='mb-3' label="Sửa thông tin " onClick={() => setChangeAddress(false)} />
                                    <Button style={{ display: changeAddress ? 'none' : 'block' }} className='mb-3' label="Hủy" onClick={() => confirmCancelCustomInfo()} />
                                    <div className="p-fluid">
                                        <div className="field">
                                            <label htmlFor="name">Tên khách hàng: {changeAddress ? infoCustomer?.nameOfRecipient : ''}</label>
                                            <InputText
                                                style={{ display: changeAddress ? 'none' : 'block' }}
                                                disabled={changeAddress}
                                                value={infoCustomer?.nameOfRecipient}
                                                className={classNames({
                                                    "p-invalid": errors.field === 'nameOfRecipient'
                                                })}
                                                onChange={(event) => setRowData(event.target.value, "nameOfRecipient")}
                                                id="name" />
                                        </div>
                                        <div className="field">
                                            <label htmlFor="email">Email: {changeAddress ? infoCustomer?.email : ''}</label>
                                            <InputText
                                                style={{ display: changeAddress ? 'none' : 'block' }}
                                                disabled={changeAddress}
                                                value={infoCustomer?.email}
                                                className={classNames({
                                                    "p-invalid": errors.field === 'email'
                                                })}
                                                onChange={(event) => setRowData(event.target.value, "email")}
                                                id="email" />
                                        </div>
                                        <div className="field">
                                            <label htmlFor="phone">Phone: {changeAddress ? infoCustomer?.phoneNumber : ''}</label>
                                            <InputText
                                                style={{ display: changeAddress ? 'none' : 'block' }}
                                                disabled={changeAddress}
                                                value={infoCustomer?.phoneNumber}
                                                className={classNames({
                                                    "p-invalid": errors.field === 'phoneNumber'
                                                })}
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
                                                className={classNames({ 'p-invalid': errors.field === 'provinceId' })}
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
                                                className={classNames({ 'p-invalid': errors.field === 'districtId' })}
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
                                                className={classNames({ 'p-invalid': errors.field === 'wardCode' })}
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
                                                onChange={(event) => setRowData(event.target.value, "address")}
                                                className={classNames({ 'p-invalid': errors.field === 'address' })}
                                                value={infoCustomer?.address}
                                                id="address"
                                                rows={3} cols={20} />
                                        </div>
                                        <div className="field">
                                            <label htmlFor="province">Loại hình vận chuyển: {changeAddress ? infoCustomer?.shipServiceName : ''}</label>
                                            <Dropdown
                                                style={{ display: changeAddress ? 'none' : '' }}
                                                disabled={changeAddress}
                                                value={Number(infoCustomer?.shipServiceId)}
                                                filter
                                                hidden
                                                showClear
                                                options={serviceId}
                                                optionLabel="short_name"
                                                className={classNames({ 'p-invalid': errors.field === 'shipServiceId' })}
                                                optionValue="service_id"
                                                onChange={(event) => setRowData(event.target.value, "shipServiceId")}
                                            ></Dropdown>
                                        </div>
                                        <div className='flex align-items-center justify-content-center'>
                                            <Button disabled={onTouch} style={{ display: changeAddress ? 'none' : 'block' }} label="Lưu" type='submit' icon="pi pi-check" loading={loading} onClick={() => onSubmit()} />
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
                    <Dialog visible={cancelCustomInfo} style={{ width: '500px' }} header="Confirm" modal footer={confirmCancelCustomInfoFooter} onHide={hideConfirmCancelCustomInfo} >
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