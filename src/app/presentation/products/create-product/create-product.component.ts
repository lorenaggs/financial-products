import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule} from '@angular/forms';
import {FinancialProductApiService} from '../../../infrastructure/adapters/financialProductApiService';
import {NgClass} from '@angular/common';
import {HeaderComponent} from '../header/header.component';

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
    private productService: FinancialProductApiService) {
  }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required]
    });
  }

  validateDates(control: AbstractControl): null {
    const releaseDateControl = control.get('releaseDate');
    const revisionDateControl = control.get('revisionDate');

    if (!releaseDateControl || !revisionDateControl) return null;

    const releaseDate = new Date(releaseDateControl.value);
    const revisionDate = new Date(revisionDateControl.value);
    const today = new Date(); // hoy sin horas/minutos/segundos
    today.setHours(0, 0, 0, 0);

    if (releaseDate < today) {
      releaseDateControl.setErrors({invalidRelease: true});
    }

    const oneYearAfter = new Date(releaseDate);
    oneYearAfter.setFullYear(oneYearAfter.getFullYear() + 1);

    if (revisionDate.getTime() !== oneYearAfter.getTime()) {
      revisionDateControl.setErrors({invalidRevision: true});
    }

    return null;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const data = this.productForm.value;
      this.productService.createFinancialProduct(data).subscribe(
        (response) => {
          if (response && response.message === 'Product added successfully') {
            alert(response.message);
            this.productForm.reset();
          }
        },
        (error) => {
          console.error('Error al crear producto:', error);
          alert(error.error.message);
        }
      );
    } else {
      this.productForm.markAllAsTouched();
    }
  }


  onReset(): void {
    this.productForm.reset();
  }
}
