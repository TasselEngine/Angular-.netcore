import { Injectable } from '@angular/core';
import { NzModalService, NzMessageService, NzNotificationService, NzModalSubject } from 'ng-zorro-antd';

@Injectable()
export class ToastService {

    constructor(
        private notify: NzNotificationService,
        private message: NzMessageService,
        private modal: NzModalService) { }

    public readonly LoadingMessage = (msg: string): string => {
        const message = this.message.loading(msg);
        return message.messageId;
    }

    public readonly InfoMessage = (msg: string): string => {
        const message = this.message.info(msg);
        return message.messageId;
    }

    public readonly SucceesMessage = (msg: string): string => {
        const message = this.message.success(msg);
        return message.messageId;
    }

    public readonly WarnMessage = (msg: string): string => {
        const message = this.message.warning(msg);
        return message.messageId;
    }

    public readonly ErrorMessage = (msg: string): string => {
        const message = this.message.error(msg);
        return message.messageId;
    }

    public readonly TryRemoveMessage = (m_id: string): void => {
        this.message.remove(m_id);
    }

    public readonly InfoToast = (title: string, msg: string, dura: number = 3000): string => {
        const toast = this.notify.info(title, msg, { nzDuration: dura });
        return toast.messageId;
    }

    public readonly SuccessToast = (title: string, msg: string, dura: number = 3000): string => {
        const toast = this.notify.success(title, msg, { nzDuration: dura });
        return toast.messageId;
    }

    public readonly WarnToast = (title: string, msg: string, dura: number = 3000): string => {
        const toast = this.notify.warning(title, msg, { nzDuration: dura });
        return toast.messageId;
    }

    public readonly ErrorToast = (title: string, msg: string, dura: number = 3000): string => {
        const toast = this.notify.error(title, msg, { nzDuration: dura });
        return toast.messageId;
    }

    public readonly TryRemoveToast = (m_id: string): void => {
        this.notify.remove(m_id);
    }

    public readonly ConfirmModal = (title: any, content: any, width?: number, closable = true, maskClosable = true, funcs: [Function, Function] = [undefined, undefined]): NzModalSubject => {
        return this.modal.confirm({
            title: title,
            content: content,
            width: width,
            closable: closable,
            maskClosable: maskClosable,
            footer: false,
            onOk: funcs[0],
            onCancel: funcs[1],
            okText: 'Yes',
            cancelText: 'No'
        });
    }

    public readonly ErrorModal = (title: any, content: any, width?: number, closable = true, maskClosable = true, funcs: [Function, Function] = [undefined, undefined]): NzModalSubject => {
        return this.modal.error({
            title: title,
            content: content,
            width: width,
            closable: closable,
            maskClosable: maskClosable,
            footer: false,
            onOk: funcs[0],
            onCancel: funcs[1],
            okText: 'Yes',
            cancelText: 'No'
        });
    }

    public readonly WarnModal = (title: any, content: any, width?: number, closable = true, maskClosable = true, funcs: [Function, Function] = [undefined, undefined]): NzModalSubject => {
        return this.modal.warning({
            title: title,
            content: content,
            width: width,
            closable: closable,
            maskClosable: maskClosable,
            footer: false,
            onOk: funcs[0],
            onCancel: funcs[1],
            okText: 'Yes',
            cancelText: 'No'
        });
    }

    public readonly InfoModal = (title: any, content: any, width?: number, closable = true, maskClosable = true, funcs: [Function, Function] = [undefined, undefined]): NzModalSubject => {
        return this.modal.info({
            title: title,
            content: content,
            width: width,
            closable: closable,
            maskClosable: maskClosable,
            footer: false,
            onOk: funcs[0],
            onCancel: funcs[1],
            okText: 'Ok',
        });
    }

    public readonly SuccessModal = (title: any, content: any, width?: number, closable = true, maskClosable = true, funcs: [Function, Function] = [undefined, undefined]): NzModalSubject => {
        return this.modal.success({
            title: title,
            content: content,
            width: width,
            closable: closable,
            maskClosable: maskClosable,
            footer: false,
            onOk: funcs[0],
            onCancel: funcs[1],
        });
    }

    public readonly ComponentModal = (title: any, component: any, params?: any, width?: number, closable = true, maskClosable = true, funcs: [Function, Function] = [undefined, undefined]): NzModalSubject => {
        return this.modal.open({
            title: title,
            content: component,
            width: width,
            closable: closable,
            maskClosable: maskClosable,
            footer: false,
            onOk: funcs[0],
            onCancel: funcs[1],
            componentParams: params,
        });
    }

}
