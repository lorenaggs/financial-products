import {Component, inject, OnInit, signal} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ReactiveFormsModule
} from '@angular/forms';
import {FinancialProductApiService} from '../../../infrastructure/adapters/financialProductApiService';
import {NgClass} from '@angular/common';
import {HeaderComponent} from '../header/header.component';
import {idNotExistsValidator} from '../../../shared/utils/idNotExistsValidator-utils';
import {ActivatedRoute} from '@angular/router';

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
  isEditMode = signal(false);
  productId = signal<string | null>(null);
  idParam: string | null = null;

  constructor(
    private route: ActivatedRoute = inject(ActivatedRoute),
    private fb: FormBuilder,
    private productService: FinancialProductApiService
  ) {

    this.idParam = this.route.snapshot.paramMap.get('id');
    if (this.idParam) {
      this.productId.set(this.idParam);
      this.isEditMode.set(true);
      this.loadProduct();
    }
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      id: ['', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
        asyncValidators: [idNotExistsValidator(this.productService)],
        updateOn: 'change'
      }],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required]
    }, {
      validators: [this.validateDates.bind(this)]
    });

    if (this.isEditMode()) {
      const id = this.route.snapshot.paramMap.get('id');
      this.productForm.patchValue({id});
    }

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
      if (control.errors?.['idExists']) {
        return 'El ID ya existe';
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
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);

    if (releaseDate < todayLocal) {
      releaseDateControl.setErrors({invalidRelease: true});
    } else if (releaseDateControl.hasError('invalidRelease')) {
      releaseDateControl.setErrors(null);
    }

    const oneYearAfter = new Date(releaseDate);
    oneYearAfter.setFullYear(oneYearAfter.getFullYear() + 1);

    if (revisionDate.getTime() !== oneYearAfter.getTime()) {
      revisionDateControl.setErrors({invalidRevision: true});
    } else if (revisionDateControl.hasError('invalidRevision')) {
      revisionDateControl.setErrors(null);
    }

    return null;
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const dataForm = this.productForm.getRawValue();
      if (this.isEditMode()) {
        this.productService.updateFinancialProduct(dataForm, this.idParam).subscribe({
          next: (response) => {
            if (response && response.message === 'Product updated successfully') {
              alert(response.message);
              this.productForm.reset();
            }
          },
          error: (error) => {
            console.error('Error updating product:', error);
          }
        });
      } else {
        this.productService.createFinancialProduct(dataForm).subscribe({
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
      }
    } else {
      this.productForm.markAllAsTouched();
    }
  }


  onReset(): void {
    this.productForm.reset();
  }

  loadProduct(): void {
    if (!this.productId()) return;

    this.productService.getFinancialProductById(this.idParam).subscribe(product => {
      this.productForm.patchValue({
        id: this.productId(),
        name: product.name,
        description: product.description,
        logo: product.logo,
        date_release: product.date_release,
        date_revision: product.date_revision
      });

      this.productForm.get('id')?.disable();
    });
  }

}
