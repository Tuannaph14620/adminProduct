
import React, { forwardRef, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import {
    ref,
    uploadBytes,
    getDownloadURL,
} from "firebase/storage";
import { storage } from '../api/fisebase';
import { v4 } from "uuid";
function TemplateDemo(props) {
    const toast = useRef(null);
    const errorImage = props.validate
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);
    const [imageUrls, setImageUrls] = useState([]);
    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        let files = e.files;

        Object.keys(files).forEach((key) => {
            _totalSize += files[key].size || 0;
        });

        setTotalSize(_totalSize);
    };

    const onTemplateUpload = (e) => {

        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    };

    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options) => {
        const { className, chooseButton } = options;
        const value = totalSize / 20000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 2 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (file, d) => {

        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '60%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Button type="button" icon="pi pi-times" className="ml-auto" rounded text severity="danger" onClick={() => onTemplateRemove(file, d.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
            </div>
        );
    };

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'p-3 border-circle-top border-circle-bottom' };


    const uploadFile = (event) => {
        const file = event.files[0];
        if (file == null) return;
        const imageRef = ref(storage, `images/${file.name + v4()}`);
        uploadBytes(imageRef, file).then((snapshot) => {
            getDownloadURL(snapshot.ref).then((url) => {
                setImageUrls((prev) => [...prev, url]);
                props.parentCallback(url)
            });
        });
    };
    return (
        <div>
            <Toast ref={toast}></Toast>
            <Tooltip target=".custom-choose-btn" content="Thêm ảnh" position="bottom" />
            <FileUpload className={errorImage == 'error' ? 'bg-red-500' : ''} ref={fileUploadRef} url={'upload'} accept="image/*" maxFileSize={2000000}
                customUpload uploadHandler={uploadFile} auto
                onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions} />
        </div>
    )
}

export default forwardRef(TemplateDemo);
