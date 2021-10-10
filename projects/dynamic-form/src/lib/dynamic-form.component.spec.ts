import { CommonModule } from '@angular/common';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { createDynamicForm } from './common';

import { DynamicFormComponent } from './dynamic-form.component';
import { ExtendedFormControl } from './form-controls';
import { DYNAMIC_FORM_CONFIG, DYNAMIC_FORM_VALIDATION_MESSAGES } from './injectors';

describe('DynamicFormComponent', () => {
  let component: DynamicFormComponent;
  let fixture: ComponentFixture<DynamicFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DynamicFormComponent],
      imports: [
        CommonModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: DYNAMIC_FORM_CONFIG, useValue: [] },
        { provide: DYNAMIC_FORM_VALIDATION_MESSAGES, useValue: {require: 'Field is required'} },
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormComponent);
    component = fixture.componentInstance;
    component.form = createDynamicForm([]);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('trackByKeyFn should return component id', () => {
    const control = new ExtendedFormControl('');
    expect(component.trackByKeyFn(0, control)).toEqual(control.id);
  });

  it('getTemplate should return template by key', () => {
    component.templates = {'name': 'some template'} as any;
    expect(component.getTemplate('name')).toEqual('some template');
  });
});
