import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Queue } from '../../../utils/app.utils';
import { AdminService, StatusService, AsyncableServiceBase } from '../../../services/app.service';
import { ServerStatus } from '../../../model/app.model';

interface IVM {
    Images: IImage[];
}

@Component({
    selector: 'tassel-common-imguplist',
    templateUrl: './img_uplist.html',
    styleUrls: ['./img_uplist.scss'],
})
export class ImageUploadListComponent extends AsyncableServiceBase {

    @Input('size')
    private size: number;
    public get QueueCapacity() { return !this.size || typeof (this.size) !== 'number' || this.size <= 0 ? 50 : this.size; }

    @Output()
    OnUploaded = new EventEmitter<IImagePayload[]>();

    @Input('saveList')
    private saveList: IImage[];

    @Input('auto')
    private auto = false;

    @Input('showSubmit')
    private showSubmit = true;
    public get NeedUpload() { return this.showSubmit; }

    private is_running = false;

    private show_upload = true;
    public get ShowUpload() { return this.show_upload; }

    private model: IVM = {
        Images: undefined
    };
    public get VM() { return this.model; }

    public uploadQueue: Queue<IImage>;

    constructor(private status: StatusService, protected admin: AdminService) { super(); }

    public readonly OnFileChanged = async (files: FileList) => {
        if (!this.model.Images) {
            this.model.Images = this.saveList || [];
            this.uploadQueue = new Queue<IImage>(this.QueueCapacity);
        }
        for (let index = 0; index < files.length; index++) {
            const file = files.item(index);
            if (!file.type.includes('image')) {
                continue;  // invalid image.
            }
            if (this.model.Images.filter(f => f.UploadFailed === false).findIndex(i => i.Name === file.name) >= 0) {
                continue; //  image is exist in ths model list and not upload failed.
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const src = reader.result as string;
                const ifile: IImage = {
                    Name: file.name,
                    Src: src,
                    SourceNeed: true,
                    ThumNeed: true,
                    File: src.split(',')[1],
                    Uploaded: false,
                    Uploading: false,
                    UploadFailed: false
                };
                const id = this.model.Images.filter(f => f.UploadFailed === true).findIndex(i => i.Name === file.name);
                if (id >= 0) {
                    this.model.Images.splice(id, 1);
                }
                this.model.Images.push(ifile);
                this.uploadQueue.Push(ifile);
            };
        }
        await this.Delay(1000);
        if (this.auto && !this.is_running) {
            this.readFileTicks();
        }
    }

    public RemoveImage = (index: number) => {
        if ((!index && index !== 0) || !this.model.Images) { return; }
        this.model.Images.splice(index, 1);
    }

    public readFileTicks = async () => {
        if (this.uploadQueue.Items.length > 0) {
            let first = this.uploadQueue.Head();
            if (first && first.UploadFailed) {
                // TO REMOVE FROM QUEUE ...
                first.Uploading = false;
                this.uploadQueue.Out();
            } else if (first && first.Uploaded) {
                // TO REMOVE FROM QUEUE ...
                first.Uploading = false;
                this.uploadQueue.Out();
            }
            first = this.uploadQueue.Head();
            if (first && !first.Uploading) {
                // TO UPLOAD WORK ...
                this.show_upload = false;
                first.Uploading = true;
                this.admin.UploadImageAsync(first.File).then(([succeed, code, error, result]) => {
                    if (succeed && code === ServerStatus.Succeed) {
                        first.Payload = result;
                        first.Payload.source_need = first.SourceNeed;
                        first.Payload.thumb_need = first.ThumNeed;
                        first.Uploaded = true;
                    } else {
                        first.Uploaded = true;
                        first.UploadFailed = true;
                    }
                });
            }
        } else {
            this.OnUploaded.emit(this.model.Images.filter(i => !i.UploadFailed).map(i => i.Payload));
            this.show_upload = true;
            this.is_running = false;
            return;
        }
        setTimeout(this.readFileTicks, 50);
    }

    public Submit = () => {
        if (this.is_running) { return; }
        this.show_upload = false;
        this.readFileTicks();
        this.is_running = true;
    }

}
