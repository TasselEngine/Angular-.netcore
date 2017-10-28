import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TasselAdminCompBase } from './../../shared/components/base.component';
import { Component, HostBinding, OnInit, state } from '@angular/core';
import { AdminService, IdentityService, StatusService } from '../../../services/app.service';
import { Router } from '@angular/router';
import { pageShowAnimation, Queue } from '../../../utils/app.utils';
import { ServerStatus } from '../../../model/app.model';

interface IStatusCreate {
    Content: string;
    Images: IImage[];
}

interface IImage {
    Name: string;
    Src: string;
    File: string;
    Uploaded: boolean;
    Uploading: boolean;
    UploadFailed: boolean;
    Payload?: IImagePayload;
}

interface IImagePayload {
    origin?: string;
    thumb?: string;
    width?: number;
    height?: number;
}

@Component({
    selector: 'tassel-admin-status',
    templateUrl: './status.html',
    animations: [pageShowAnimation],
    styleUrls: [
        './admin-status.scss'
    ]
})
export class AdminStatusComponent extends TasselAdminCompBase implements OnInit {

    @HostBinding('@routeAnimation') routeAnimation = true;
    @HostBinding('style.display') display = 'block';

    private model: IStatusCreate = {
        Content: 'text status create',
        Images: []
    };
    public get VM() { return this.model; }

    public uploadQueue: Queue<IImage>;

    public ImageBinding: any;

    constructor(
        private formbuilder: FormBuilder,
        private status: StatusService,
        protected admin: AdminService,
        protected identity: IdentityService,
        protected router: Router) {
        super(admin, identity, router);
    }

    ngOnInit(): void {
        this.uploadQueue = new Queue<IImage>(50);
    }

    public readonly OnFileChanged = (files: FileList) => {
        for (let index = 0; index < files.length; index++) {
            const file = files.item(index);
            if (!file.type.includes('image')) { continue; }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                const src = reader.result as string;
                const ifile: IImage = {
                    Name: file.name,
                    Src: src,
                    File: src.split(',')[1],
                    Uploaded: false,
                    Uploading: false,
                    UploadFailed: false
                };
                this.model.Images.push(ifile);
                this.uploadQueue.Push(ifile);
            };
        }
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
                first.Uploading = true;
                this.admin.UploadImageAsync(first.File).then(([succeed, code, error, result]) => {
                    if (succeed && code === ServerStatus.Succeed) {
                        first.Payload = result;
                        first.Uploaded = true;
                    } else {
                        first.Uploaded = true;
                        first.UploadFailed = true;
                    }
                });
            }
        } else {
            // TO UPLOAD
            this.status.CreateStatusAsync({
                content: this.model.Content,
                user_name: this.identity.CurrentUser.FriendlyName,
                uid: this.identity.CurrentUUID,
                images: this.model.Images.filter(i => !i.UploadFailed).map(i => i.Payload)
            });
            return;
        }
        setTimeout(this.readFileTicks, 50);
    }

    public Submit = () => {
        this.readFileTicks();
    }

}
