import { ExtendedControls, ExtendedFormArray, ExtendedFormControl, ExtendedFormGroup } from '../../form-controls';
import { ErrorObject } from '../../interfaces';

export class CommonHelper {
  public static instantError(control: ExtendedControls, asString: false): ErrorObject | null;
  public static instantError(control: ExtendedControls, asString: true): string | null
  public static instantError(control: ExtendedControls, asString: boolean = true): string | null | ErrorObject {
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
    const error = customError || rootValidationMessage || firstKey;

    let errorString = error as string;

    if (typeof error === 'function') {
      errorString = error(errors[firstKey]);
    }

    if (!asString) {
      return { key: firstKey, message: errorString, params: errors[firstKey] }
    }

    return errorString;
  }

  public static getFirstInvalidControl(control: ExtendedFormGroup | ExtendedFormArray): ExtendedFormControl | null {
    for (const item of control.childrenControls) {
      if (!item.invalid) {
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
