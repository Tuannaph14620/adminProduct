import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber } from 'primereact/inputnumber';
import { addProductOption, listOneProduct, listProductOption, removeProductOption, updateProductOption } from '../../api/product';
import { listSize } from '../../api/size';
import { listColor } from '../../api/color';
import { useParams } from 'react-router-dom';
import { Dropdown } from 'primereact/dropdown';
import { Image } from 'primereact/image';
import TemplateDemo from '../../component/FileUpload';
import { classNames } from 'primereact/utils';
const DeatailProductPage = (props) => {
    const { id } = useParams();
    let emptyProduct = {
        id: null,
        productId: id,
        colorId: null,
        qty: null,
        price: null,
        image: null,
        sizeId: null
    };
    const [products, setProducts] = useState(null);
    const [errors, setErrors] = useState({ field: "" });
    const [productDetail, setProductDetail] = useState(null);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [color, setColor] = useState(null);
    const [size, setSize] = useState(null);
    const [editStatus, setEditStatus] = useState(false)
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
        listProductOption(
            {
                sizeId: "",
                colorId: "",
                productId: id,
                active: true,
                pageReq: {
                    page: 0,
                    pageSize: 100,
                    sortField: "",
                    sortDirection: ""
                }
            }
        ).then((res) => {
            const _data = res?.data.data
            setProducts(_data);
            setLoading(false);
        });
        listOneProduct(id).then((res) => {
            const _data = res?.data.data
            setProductDetail(_data);
            setLoading(false);
        })
    };

    const getAll = () => {
        listColor(
            {
                id: "",
                active: true,
                textSearch: "",
                pageReq: {
                    page: 0,
                    pageSize: 100,
                    sortField: "",
                    sortDirection: ""
                }
            }
        ).then((res) => {
            const _data = res?.data.data.map((e) => {
                return {
                    ...e,
                    id: e.id,
                    nameColor: e.name
                }
            })
            setColor(_data);
        });
        listSize(
            {
                id: "",
                active: true,
                textSearch: "",
                pageReq: {
                    page: 0,
                    pageSize: 100,
                    sortField: "",
                    sortDirection: ""
                }
            }
        ).then((res) => {
            const _data = res?.data.data.map((e) => {
                return {
                    ...e,
                    id: e.id,
                    nameSize: e.name
                }
            })
            setSize(_data);
        })
    }

    const onSubmit = (event) => {
        setLoading(true);
        event.preventDefault();
        if (!validate()) {
            setLoading(false);
            return;
        }
        setErrors({ field: '' })
        if (editStatus) {
            updateProductOption(product).then((res) => {
                if (res) {
                    searchAll();
                    setLoading(false);
                    setProduct(emptyProduct);
                    setEditStatus(false)
                    setProductDialog(false)
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Sửa thành công', life: 1000 });
                }

            })
        } else {
            addProductOption(product).then((res) => {
                if (res) {
                    searchAll();
                    setLoading(false);
                    setProduct(emptyProduct);
                    setProductDialog(false)
                    toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Thêm thành công', life: 1000 });
                }
            })
        }
    }

    const openNew = () => {
        getAll();
        setErrors({ field: '' })
        setProduct(emptyProduct)
        setProductDialog(true);
    };

    const hideDialog = () => {
        setProduct(emptyProduct);
        setProductDialog(false);
        setEditStatus(false)
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeleteProductsDialog(false);
    };

    const editProduct = (data) => {
        setEditStatus(true);
        setProduct({ ...data });
        getAll();
        setProductDialog(true);
    };


    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };
    const deleteProduct = () => {
        const ids = product?.id
        removeProductOption(ids).then((res) => {
            if (res) {
                searchAll();
                // onChangeSelectedRows([]);
                setDeleteProductDialog(false);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Xóa thành công', life: 1000 });
            }
        });
    };


    const confirmDeleteSelected = () => {
        setDeleteProductsDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = products.filter((val) => !selectedProducts.includes(val));
        setProducts(_products);
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
            <h4 className="m-0">Phân loại sản phẩm</h4>
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
        const _dataTable = { ...product };
        const _error = { ...errors };
        if (!_dataTable.image) {
            _error.field = "image";
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập ảnh sản phẩm', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.colorId) {
            _error.field = 'colorId';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập màu sản phẩm', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.sizeId) {
            _error.field = 'sizeId';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập kích cỡ sản phẩm', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.qty) {
            _error.field = 'qty';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập số lượng', life: 3000 });
            setErrors(_error);
            return false;
        }
        if (!_dataTable.price) {
            _error.field = 'price';
            toast.current.show({ severity: 'warn', summary: 'Cảnh báo', detail: 'Vui lòng nhập đơn giá', life: 3000 });
            setErrors(_error);
            return false;
        }
        return true;
    }
    const setRowData = (value, field) => {
        const table = { ...product };
        switch (field) {
            default: {
                setErrors({ field: '' })
                table[field] = value;
            }
        }

        setProduct(table);
    };
    const callbackFunction = (childData) => {
        const _image = { ...product }
        _image.image = childData
        setProduct(_image)
    }

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                    <Accordion activeIndex={0}>
                        <AccordionTab header="Thông tin sản phẩm">
                            <div className='flex align-items-start'>
                                <div className='item1' style={{ marginRight: '200px' }}>
                                    <p>Tên sản phẩm: {productDetail?.productName}</p>
                                    <p>Danh mục: {productDetail?.categoryName}</p>
                                    <p>Chất liệu: {productDetail?.materialName}</p>
                                    <p>Trọng lượng áo: {productDetail?.weight}g</p>
                                    <p>Giá cao nhất: {productDetail?.maxPrice?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</p>
                                </div>
                                <div className='item2'>
                                    <p>Độ dày của áo: {productDetail?.length}</p>
                                    <p>Độ rộng của áo: {productDetail?.width}m</p>
                                    <p>Chiều dài áo : {productDetail?.height}m</p>
                                    <p>Giá thấp nhất: {productDetail?.minPrice?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</p>
                                </div>
                            </div>
                            <p>Mô tả: {productDetail?.description}</p>
                        </AccordionTab>
                    </Accordion>
                    <DataTable
                        ref={dt}
                        value={products}
                        selection={selectedProducts}
                        onSelectionChange={(e) => setSelectedProducts(e.value)}
                        dataKey="id"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter}
                        emptyMessage="No products found."
                        header={header}
                        loading={loading}
                        responsiveLayout="scroll"
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                        <Column field="code" header="Số lượng" sortable body={(d) => <span >{d.qty}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="image" header="Hình ảnh" sortable body={(d) => <img src={d.image} className="shadow-2" width="100"></img>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="price" header="Giá tiền" sortable body={(d) => <span >{d?.price?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="color" header="Màu sắc" sortable body={(d) => <span >{d.colorName}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column field="size" header="Kích cỡ" sortable body={(d) => <span >{d.sizeName}</span>} headerStyle={{ minWidth: '15rem' }}></Column>
                        <Column header="Chức năng" body={(d) => actionBodyTemplate(d)} headerStyle={{ minWidth: '10rem' }}></Column>
                    </DataTable>

                    <Dialog visible={productDialog} style={{ width: '450px' }} header={editStatus ? "Sửa sản phẩm " : "Thêm mới sản phẩm"} modal className="p-fluid" onHide={hideDialog}>
                        <form onSubmit={onSubmit}>
                            <div className="field">
                                <label htmlFor="image">Hình ảnh</label>
                                <TemplateDemo parentCallback={callbackFunction}></TemplateDemo>
                                <Image hidden={!editStatus} src={product?.image} width="100" />
                            </div>
                            <div className="field">
                                <label htmlFor="height">Màu sắc</label>
                                <Dropdown
                                    value={product?.colorId}
                                    filter
                                    showClear
                                    options={color}
                                    optionLabel="nameColor"
                                    optionValue="id"
                                    onChange={(event) => setRowData(event.target.value, "colorId")}
                                    className={classNames({ 'p-invalid': errors.field === 'colorId' })}
                                ></Dropdown>
                            </div>
                            <div className="field">
                                <label htmlFor="height">Kích cỡ</label>
                                <Dropdown
                                    value={product?.sizeId}
                                    filter
                                    showClear
                                    options={size}
                                    optionLabel="nameSize"
                                    optionValue="id"
                                    onChange={(event) => setRowData(event.target.value, "sizeId")}
                                    className={classNames({ 'p-invalid': errors.field === 'sizeId' })}
                                ></Dropdown>
                            </div>
                            <div className="field">
                                <label htmlFor="qty">Số lượng</label>
                                <InputNumber
                                    value={product.qty}
                                    onChange={(event) => setRowData(event.value, "qty")}
                                    className={classNames({ 'p-invalid': errors.field === 'qty' })}
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="price">Đơn giá</label>
                                <InputNumber
                                    value={product.price}
                                    onChange={(event) => setRowData(event.value, "price")}
                                    className={classNames({ 'p-invalid': errors.field === 'price' })}
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
                            {product && (
                                <span>
                                    Bạn có chắc chắn muốn xóa <b>{product.code}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog>

                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog>
                </div>
            </div>
        </div>
    );

}

export default DeatailProductPage