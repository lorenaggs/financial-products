import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule
} from '@angular/forms';
import { FinancialProductApiService } from '../../../infrastructure/adapters/financialProductApiService';
import { NgClass } from '@angular/common';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass,
    HeaderComponent
  ],
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {
  public productForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: FinancialProductApiService
  ) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required]
    }, {
      validators: [this.validateDates.bind(this)]
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.productForm.get(fieldName);
    if (control && control.invalid && (control.touched || control.dirty)) {
      if (control.errors?.['required']) {
        return 'Este campo es obligatorio';
      }
      if (control.errors?.['minlength']) {
        return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
      }
      if (control.errors?.['maxlength']) {
        return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
      }
      if (control.errors?.['invalidRelease']) {
        return 'La fecha de liberación debe ser hoy o posterior';
      }
      if (control.errors?.['invalidRevision']) {
        return 'La fecha de revisión debe ser exactamente 1 año posterior a la liberación';
      }
    }
    return '';
  }

  validateDates(control: AbstractControl): null {
    const releaseDateControl = control.get('date_release');
    const revisionDateControl = control.get('date_revision');

    if (!releaseDateControl || !revisionDateControl) {
      return null;
    }

    const releaseDate = new Date(releaseDateControl.value);
    const revisionDate = new Date(revisionDateControl.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (releaseDate < today) {
      releaseDateControl.setErrors({ invalidRelease: true });
    } else if (releaseDateControl.hasError('invalidRelease')) {
      releaseDateControl.setErrors(null);
    }

    const oneYearAfter = new Date(releaseDate);
    oneYearAfter.setFullYear(oneYearAfter.getFullYear() + 1);
    if (revisionDate.getTime() !== oneYearAfter.getTime()) {
      revisionDateControl.setErrors({ invalidRevision: true });
    } else if (revisionDateControl.hasError('invalidRevision')) {
      revisionDateControl.setErrors(null);
    }

    return null;
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const data = this.productForm.value;
      this.productService.createFinancialProduct(data).subscribe({
        next: (response) => {
          if (response && response.message === 'Product added successfully') {
            alert(response.message);
            this.productForm.reset();
          }
        },
        error: (error) => {
          console.error('Error creating product:', error);
        }
      });
    } else {
      this.productForm.markAllAsTouched();
    }
  }

  onReset(): void {
    this.productForm.reset();
  }
}
