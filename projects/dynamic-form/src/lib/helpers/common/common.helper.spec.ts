import { Validators } from '@angular/forms';
import { ExtendedFormControl, ExtendedFormGroup } from '../../form-controls';
import { CommonHelper } from './common.helper';

describe('CommonHelper', () => {

  /* -------------------- instantError --------------------*/

  it('instantError should return default message', () => {
    const form = new ExtendedFormGroup({ name: new ExtendedFormControl('', [Validators.required]) });
    const control = form.get('name');
    form.defaultValidationMessages = { required: 'Field is required' };
    control.fieldConfig = {} as any;
    expect(CommonHelper.instantError(control)).toEqual('Field is required');
  });

  it('instantError should return default message from function', () => {
    const form = new ExtendedFormGroup({ name: new ExtendedFormControl(99, [Validators.min(100)]) });
    const control = form.get('name');
    form.defaultValidationMessages = { min: v => `Value must be greater than ${v.min}` };
    control.fieldConfig = {} as any;
    expect(CommonHelper.instantError(control)).toEqual('Value must be greater than 100');
  });

  it('instantError should return custom error message', () => {
    const control = new ExtendedFormControl('', [Validators.required]);
    control.fieldConfig = { validationMessages: { required: 'Field is required' } } as any;
    expect(CommonHelper.instantError(control)).toEqual('Field is required');
  });

  it('instantError should return custom error message from function', () => {
    const control = new ExtendedFormControl(99, [Validators.min(100)]);
    control.fieldConfig = { validationMessages: { min: (v: any) => `Value must be greater than ${v.min}` } } as any;
    expect(CommonHelper.instantError(control)).toEqual('Value must be greater than 100');
  });

  it('instantError should return "Error"', () => {
    const control = new ExtendedFormControl('', [Validators.required]);
    control.fieldConfig = { } as any;
    expect(CommonHelper.instantError(control)).toEqual('Error');
  });

  it('instantError should return "null"', () => {
    const control = new ExtendedFormControl('');
    control.fieldConfig = { } as any;
    expect(CommonHelper.instantError(control)).toEqual(null);
  });

  /* -------------------- ---------------------- --------------------*/



  /* -------------------- getFirstInvalidControl --------------------*/

  it('getFirstInvalidControl should return "null"', () => {
    const login = new ExtendedFormControl('login', [Validators.required]);
    const password = new ExtendedFormControl('password', [Validators.required]);

    login.fieldConfig = {} as any;
    password.fieldConfig = {} as any;

    const form = new ExtendedFormGroup({ login, password });

    form.updateChildrenControls();

    expect(CommonHelper.getFirstInvalidControl(form)).toEqual(null);
  });

  it('getFirstInvalidControl should return password control', () => {
    const login = new ExtendedFormControl('login', [Validators.required]);
    const password = new ExtendedFormControl('', [Validators.required]);

    login.fieldConfig = {} as any;
    password.fieldConfig = {} as any;

    const form = new ExtendedFormGroup({ login, password });

    form.updateChildrenControls();

    expect(CommonHelper.getFirstInvalidControl(form)).toEqual(password);
  });

  /* -------------------- ---------------------- --------------------*/
});
