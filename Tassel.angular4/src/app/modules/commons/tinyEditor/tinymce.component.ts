import {
    Component,
    OnDestroy,
    AfterViewInit,
    EventEmitter,
    Input,
    Output
} from '@angular/core';

declare var tinymce: any;

@Component({
    selector: 'tassel-tiny-editor',
    template: `<textarea id="{{elementId}}"></textarea>`
})
export class TinyMCEEditorComponent implements AfterViewInit, OnDestroy {
    @Input() elementId: String;
    @Output() onEditorKeyup = new EventEmitter<any>();

    editor;

    ngAfterViewInit() {
        tinymce.baseURL = '/assets/tinymce';
        tinymce.init({
            selector: '#' + this.elementId,
            plugins: ['link', 'paste', 'table', 'code', 'textcolor', 'colorpicker', 'codesample'],
            toolbar: 'forecolor backcolor codesample',
            codesample_languages: [
                { text: 'HTML/XML', value: 'markup' },
                { text: 'JavaScript', value: 'javascript' },
                { text: 'CSS', value: 'css' },
                { text: 'PHP', value: 'php' },
                { text: 'Ruby', value: 'ruby' },
                { text: 'Python', value: 'python' },
                { text: 'Java', value: 'java' },
                { text: 'C', value: 'c' },
                { text: 'C#', value: 'csharp' },
                { text: 'C++', value: 'cpp' }
            ],
            setup: editor => {
                this.editor = editor;
                editor.on('keyup', () => {
                    const content = editor.getContent();
                    this.onEditorKeyup.emit(content);
                });
            },
        });
    }

    ngOnDestroy() {
        tinymce.remove(this.editor);
    }
}
