import { ExtendedFormArray, ExtendedFormControl, ExtendedFormGroup } from '../../form-controls';

export class CommonHelper {
  public static instantError(control: ExtendedFormControl | ExtendedFormGroup | ExtendedFormArray): string | null {
    let firstKey = '';
    const errors = control.errors;

    if (!errors) {
      return null;
    }

    for (const key in errors) {
      if (errors.hasOwnProperty(key)) {
        firstKey = key;
        break;
      }
    }

    const customError = control.fieldConfig.validationMessages && control.fieldConfig.validationMessages[firstKey];
    const root = control.root as ExtendedFormGroup;
    const rootValidationMessage = root.defaultValidationMessages && root.defaultValidationMessages[firstKey]
    const error = customError || rootValidationMessage || 'Error';

    if (typeof error === 'function') {
      return error(errors[firstKey]);
    }

    return error;
  }

  public static getFirstInvalidControl(control: ExtendedFormGroup | ExtendedFormArray): ExtendedFormControl | null {
    for (const item of control.childrenControls) {
      if (item.valid) {
        continue;
      }

      if (item instanceof ExtendedFormControl) {
        return item;
      } else {
        return this.getFirstInvalidControl(item);
      }
    }

    return null;
  }
}
