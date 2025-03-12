import {AbstractControl, AsyncValidatorFn} from '@angular/forms';
import {map, Observable, of, switchMap, timer} from 'rxjs';
import {FinancialProductApiService} from '../../infrastructure/adapters/financialProductApiService';
import {catchError} from 'rxjs/operators';

export function idNotExistsValidator(productService: FinancialProductApiService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<{ idExists: boolean } | null> => {
    if (!control.value || control.value.length < 3) {
      return of(null);
    }
    return timer(300).pipe(
      switchMap(() => {
        return productService.verificationId(control.value);
      }),
      map((exists: boolean) => {
        return exists ? { idExists: true } : null;
      }),
      catchError((err) => {
        console.error('Error en la verificación del ID:', err);
        return of(null);
      })
    );
  };
}
