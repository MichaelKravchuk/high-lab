import { Component, ElementRef, HostBinding, Input, OnInit, TemplateRef } from '@angular/core';
import { AbstractField } from './base.field';
import { ExtendedFormGroup } from './form-controls';

@Component({
    template: '',
})
export class BaseFieldComponent implements OnInit {
    public readonly self = this;

    @Input()
    public readonly fieldConfig!: AbstractField;

    @Input()
    public readonly formGroup!: ExtendedFormGroup;

    @Input()
    public readonly template?: TemplateRef<any> | { [key: string]: TemplateRef<any> };

    @HostBinding('class')
    public get classList(): string {
        return this.fieldConfig.class || '';
    }

    constructor(protected readonly elementRef: ElementRef) {}

    public ngOnInit() {
        this.control.htmlInstance = this.elementRef.nativeElement;
    }

    public get control(): any {
        return this.formGroup.get(this.fieldConfig.key);
    }

    public get required(): boolean {
        return this.hasValidator('required');
    }

    public hasValidator(key: string): boolean {
        const control = this.control;
        if (control.validator) {
            const validators = control.validator('' as any);
            return !!(validators && validators.hasOwnProperty(key));
        }

        return false;
    }

    public get disabled(): boolean {
        return this.control.disabled;
    }

    public get label(): string | null {
        // @ts-ignore
        return this.fieldConfig.label(this.formGroup);
    }

    public get hasTemplateRef(): boolean {
        return !!this.template && (this.template instanceof TemplateRef || this.template.root instanceof TemplateRef);
    }
}
