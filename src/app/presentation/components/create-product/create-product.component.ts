import {Component, inject, OnInit, signal} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
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
  minDate = '';

  constructor(
    private route: ActivatedRoute = inject(ActivatedRoute),
    private fb: FormBuilder,
    private productService: FinancialProductApiService
  ) {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Los meses comienzan en 0
    const yyyy = today.getFullYear();
    this.minDate = `${yyyy}-${mm}-${dd}`;


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
      date_revision: [{ value: '', disabled: true }, Validators.required],
    }, {
    });

    if (this.isEditMode()) {
      const id = this.route.snapshot.paramMap.get('id');
      this.productForm.patchValue({id});
    }

    this.productForm.get('date_release')?.valueChanges.subscribe((value: string) => {
      if (value) {
        const releaseDate = new Date(value);
        const today = new Date();
        if (releaseDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
          this.productForm.get('date_release')?.setErrors({ invalidRelease: true });
          this.productForm.get('date_revision')?.setValue('');
        } else {
          const revisionDate = new Date(releaseDate);
          revisionDate.setFullYear(revisionDate.getFullYear() + 1);
          const revisionDateStr = revisionDate.toISOString().split('T')[0];
          this.productForm.get('date_revision')?.setValue(revisionDateStr);
          this.productForm.get('date_release')?.setErrors(null);
        }
      } else {
        this.productForm.get('date_revision')?.setValue('');
      }
    });

  }


  getFieldError(fieldName: string): string {
    const control = this.productForm.get(fieldName);

    if (control && control.invalid && (control.touched || control.dirty)) {
      if (control.errors?.['required']) {
        return 'Este campo es requerido!';
      }
      if (control.errors?.['minlength']) {
        return `Mínimo ${control.errors['minlength'].requiredLength} caracteres!`;
      }
      if (control.errors?.['maxlength']) {
        return `Máximo ${control.errors['maxlength'].requiredLength} caracteres`;
      }
      if (control.errors?.['idExists']) {
        return 'ID no válido!';
      }
      if (control.errors?.['invalidRelease']) {
        return 'La fecha de liberación debe ser hoy o posterior!';
      }
      if (control.errors?.['invalidRevision']) {
        return 'La fecha de revisión debe ser exactamente 1 año posterior a la liberación!';
      }
    }
    return '';
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
    if (this.isEditMode()) {
      this.productForm.reset({
        id: this.productId(),
      });
      this.productForm.get('id')?.disable();
    } else {
      this.productForm.reset();
    }
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
