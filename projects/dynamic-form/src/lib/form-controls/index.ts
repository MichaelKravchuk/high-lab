import { ExtendedFormControl } from './extended-form-control';
import { ExtendedFormGroup } from './extended-form-group';
import { ExtendedFormArray } from './extended-form-array';

export * from './extended-form-group';
export * from './extended-form-array';
export * from './extended-form-control';

export type ExtendedControls = ExtendedFormControl | ExtendedFormGroup | ExtendedFormArray;
