import {
    ComponentFactoryResolver,
    Directive,
    EmbeddedViewRef,
    Input,
    OnChanges,
    Renderer2,
    SimpleChanges,
    TemplateRef,
    ViewContainerRef,
    ɵstringify,
} from '@angular/core';
import { BaseFieldComponent } from './base.component';

@Directive({ selector: '[dynamicFormContent]' })
export class DynamicFormContentDirective implements OnChanges {
    private context = new DfContentContext();
    private thenTemplateRef: TemplateRef<DfContentContext> | null = null;
    private thenViewRef: EmbeddedViewRef<any> | null = null;
    private customViewRef: EmbeddedViewRef<any> | null = null;

    constructor(private readonly viewContainer: ViewContainerRef,
                private readonly componentFactoryResolver: ComponentFactoryResolver,
                private readonly renderer2: Renderer2,
                private readonly templateRef: TemplateRef<DfContentContext>
    ) {
        this.thenTemplateRef = templateRef;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.context.$implicit.hasTemplateRef && !this.customViewRef) {
            this.clearViewExclude(this.customViewRef);
            this.customViewRef = this.viewContainer.createEmbeddedView(
                this.context.$implicit.template as any,
                { component: this.context.$implicit, formTemplate: this.thenTemplateRef }
            );
        } else if (this.thenTemplateRef && !this.thenViewRef) {
            this.clearViewExclude(this.thenTemplateRef);
            this.thenViewRef = this.viewContainer.createEmbeddedView(this.thenTemplateRef, this.context);
        }
    }

    @Input()
    public set dynamicFormContent(condition: BaseFieldComponent) {
        this.context.$implicit = condition;
    }

    @Input()
    public set dynamicFormContentThen(templateRef: TemplateRef<DfContentContext> | null) {
        assertTemplate('dynamicFormContentThen', templateRef);
        this.thenTemplateRef = templateRef;
        this.thenViewRef = null; // clear previous view if any.
    }

    private clearViewExclude(excludeView: any): void {
        this.viewContainer.clear();

        if (excludeView !== this.thenViewRef) {
            this.thenViewRef = null;
        }

        if (excludeView !== this.customViewRef) {
            this.customViewRef = null;
        }
    }
}


export function assertTemplate(property: string, templateRef: TemplateRef<any> | null): void {
    const isTemplateRefOrNull = !!(!templateRef || templateRef.createEmbeddedView);
    if (!isTemplateRefOrNull) {
        throw new Error(`${property} must be a TemplateRef, but received '${ɵstringify(templateRef)}'.`);
    }
}

export class DfContentContext {
    public $implicit!: BaseFieldComponent;
}
