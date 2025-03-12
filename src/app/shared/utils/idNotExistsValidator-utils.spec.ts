import { AbstractControl } from '@angular/forms';
import { of } from 'rxjs';
import { idNotExistsValidator } from './idNotExistsValidator-utils';
import { FinancialProductApiService } from '../../infrastructure/adapters/financialProductApiService';
import { fakeAsync, tick } from '@angular/core/testing';

describe('idNotExistsValidator', () => {
  let productServiceMock: jest.Mocked<FinancialProductApiService>;
  let validatorFn: (control: AbstractControl) => any;

  beforeEach(() => {
    productServiceMock = {
      verificationId: jest.fn()
    } as unknown as jest.Mocked<FinancialProductApiService>;

    validatorFn = idNotExistsValidator(productServiceMock);
  });

  it('should return null if value is empty or too short', fakeAsync(() => {
    const control = { value: '' } as AbstractControl;
    let result: any;

    validatorFn(control).subscribe((res: any) => (result = res));
    tick(300);

    expect(result).toBeNull();
  }));

  it('should return null if ID does not exist (service returns false)', fakeAsync(() => {
    productServiceMock.verificationId.mockReturnValue(of(false));
    const control = { value: '123' } as AbstractControl;
    let result: any;

    validatorFn(control).subscribe((res: any) => (result = res));
    tick(300);

    expect(result).toBeNull();
    expect(productServiceMock.verificationId).toHaveBeenCalledWith('123');
  }));

  it('should return { idExists: true } if ID exists (service returns true)', fakeAsync(() => {
    productServiceMock.verificationId.mockReturnValue(of(true));
    const control = { value: '123' } as AbstractControl;
    let result: any;

    validatorFn(control).subscribe((res: any) => (result = res));
    tick(300);

    expect(result).toEqual({ idExists: true });
    expect(productServiceMock.verificationId).toHaveBeenCalledWith('123');
  }));

  it('should handle errors and return null', fakeAsync(() => {
    productServiceMock.verificationId.mockImplementation(() => {
      throw new Error('API Error: ERROR CONTROLADO');
    });
    const control = { value: '123' } as AbstractControl;
    let result: any;

    validatorFn(control).subscribe((res: any) => (result = res));
    tick(300);

    expect(result).toBeNull();
  }));
});
