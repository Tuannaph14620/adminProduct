import React, { useEffect, useRef, useState } from 'react'
import { OverlayPanel } from 'primereact/overlaypanel';
import { Fieldset } from 'primereact/fieldset';
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
import { RadioButton } from 'primereact/radiobutton';
import { Calendar } from 'primereact/calendar';
import { classNames } from 'primereact/utils';
import { listProvince } from '../../api/ghn';
import { Dropdown } from 'primereact/dropdown';
import { useNavigate } from 'react-router-dom';
const OrderPage = () => {
    const refFilterPanel = useRef(null);
    const navigator = useNavigate();
    const [_validate, setValidate] = useState({});
    const [orders, setOrders] = useState(null);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [order, setOrder] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [globalFilter, setGlobalFilter] = useState(null);
    const [loading, setLoading] = useState(true);
    const defaultData = {
        payed: null,
        startDate: null,
        endDate: null,
    };
    const [filterData, setFilterData] = useState(defaultData);
    const toast = useRef(null);
    const dt = useRef(null);
    useEffect(() => {
        searchAll();
    }, [filterData.payed, filterData.startDate, filterData.endDate]);

    const searchAll = () => {
        setLoading(true);
        listOrder(
            {
                status: "",
                orderCode: "",
                email: "",
                phoneNumber: "",
                payed: filterData.payed,
                startDate: filterData.startDate,
                endDate: filterData.endDate,
                pageReq: {
                    page: 0,
                    pageSize: 1000,
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

    const exportCSV = () => {
        dt.current.exportCSV();
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <Button icon="pi pi-eye" severity="secondary" rounded className="mr-2" onClick={() => navigator(`/orders/${rowData?.orderId}`)} />
            </>
        );
    };

    const header = (
        <>
            <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                <h4 className="m-0">Tất cả đơn hàng</h4>
                <span className="block mt-2 md:mt-0 p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText style={{ width: '400px' }} type="search" onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Tìm kiếm" />
                </span>
                <div className="px-2 ">
                    <React.Fragment>
                        <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
                    </React.Fragment>
                    <Button
                        icon="pi pi-filter"
                        tooltip={"Lọc"}
                        className='ml-3'
                        tooltipOptions={{ position: "top" }}
                        onClick={(e) => {
                            refFilterPanel.current.toggle(e);
                        }}
                    ></Button>
                </div>
            </div>

        </>
    );

    const setFilter = (field, value) => {
        const _filter = { ...filterData };
        const __validate = { ..._validate };
        switch (field) {
            case "startDate": {
                if (value && _filter.endDate && value > _filter.endDate) {
                    _filter.startDate = value;
                    __validate.startDate = "error";
                    __validate.endDate = "error";
                    setValidate(__validate);
                    setFilterData(_filter);
                    return;
                }
                __validate.startDate = null;
                __validate.endDate = null;
                _filter.startDate = value;
                break;
            }
            case "endDate": {
                if (value && _filter.startDate && value < _filter.startDate) {
                    _filter.endDate = value;
                    __validate.startDate = "error";
                    __validate.endDate = "error";
                    setValidate(__validate);
                    setFilterData(_filter);
                    return;
                }
                __validate.startDate = null;
                __validate.endDate = null;
                _filter.endDate = value;
                break;
            }
            default:
                _filter[field] = value;
        }
        setValidate(__validate);
        setFilterData(_filter);
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <DataTable
                        ref={dt}
                        value={orders}
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
                        <Column field="orderCode" header="Mã đơn hàng" sortable body={(d) => <span >{d.orderCode}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="createdDate" header="Ngày đặt" sortable body={(d) => <span >{moment(d.createdDate).format('D-MM-YYYY HH:mm:ss')}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="payed" header="Trạng thái thanh toán" body={(d) => <span >{d.payed ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="total" header="Thành tiền" body={(d) => <span >{d?.total?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="paymentMethod" header="Phương thức thành toán" body={(d) => <span >{d.paymentMethod}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="status" header="Trạng thái đơn hàng" align={'center'} body={(d) => <Tag className="mr-2" severity={d.status == 'PENDING' ? 'warning' : d.status == 'RECEIVED' ? 'Success' : ''} value={d.statusValue}></Tag>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column header="Chức năng" body={(d) => actionBodyTemplate(d)} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <OverlayPanel ref={refFilterPanel} className="x-menu" style={{ width: "560px" }}>
                        <div className="grid formgrid p-fluid fluid mb-2">
                            <div className="col-12 flex gap-8 align-items-center">
                                <div >
                                    <span className="">
                                        <RadioButton
                                            inputId="city1"
                                            name="city"
                                            onChange={() => setFilter("payed", true)}
                                            checked={filterData.payed === true}
                                        />
                                        <label className='ml-2' htmlFor="city1">Đã thanh toán</label>
                                    </span>
                                </div>
                                <div >
                                    <span className="">
                                        <RadioButton
                                            inputId="city1"
                                            name="city"
                                            onChange={() => setFilter("payed", false)}
                                            checked={filterData.payed === false}
                                        />
                                        <label className='ml-2' htmlFor="city1">Chưa thanh toán</label>
                                    </span>
                                </div>
                                <div >
                                    <span className="">
                                        <RadioButton
                                            inputId="city1"
                                            name="city"
                                            onChange={() => setFilter("payed", null)}
                                            checked={filterData.payed === null}
                                        />
                                        <label className='ml-2' htmlFor="city1">Tất cả</label>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="grid formgrid p-fluid fluid p-1">
                            <div className="col-12 flex justify-content-between align-items-center">
                                <div>Từ ngày</div>
                                <div>
                                    <Calendar
                                        value={filterData.startDate}
                                        onChange={(e) => {
                                            setFilter("startDate", e.value);
                                        }}
                                        className={classNames({
                                            "invalid": _validate.startDate === "error",
                                        })}
                                        style={{ width: "150px" }}
                                        placeholder="dd/mm/yyyy"
                                    ></Calendar>
                                </div>
                                <div>Đến ngày</div>
                                <div>
                                    <Calendar
                                        value={filterData.endDate}
                                        onChange={(e) => {
                                            setFilter("endDate", e.value);
                                        }}
                                        className={classNames({
                                            "invalid": _validate.endDate === "error",
                                        })}
                                        style={{ width: "150px" }}
                                        placeholder="dd/mm/yyyy"
                                    ></Calendar>
                                </div>
                            </div>
                        </div>
                    </OverlayPanel>
                </div>
            </div>
        </div>
    );

}

export default OrderPage