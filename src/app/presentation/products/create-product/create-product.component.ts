import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule} from '@angular/forms';
import {FinancialProductApiService} from '../../../infrastructure/adapters/financialProductApiService';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass
  ],
  styleUrls: ['./create-product.component.scss']
})

export class CreateProductComponent implements OnInit {

  productForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private productService: FinancialProductApiService) {
  }

  ngOnInit(): void {
    // Definimos las validaciones de cada campo
    this.productForm = this.fb.group({
      id: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(10)]
      ],
      name: [
        '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(100)]
      ],
      description: [
        '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(200)]
      ],
      logo: ['', [Validators.required]],
      releaseDate: ['', [Validators.required]],
      revisionDate: ['', [Validators.required]]
    }, {
      validators: [this.validateDates] // Validación que afecta a más de un campo
    });

    // Ejemplo de verificación asíncrona del ID (si tu API lo requiere)
    // this.productForm.get('id')?.valueChanges.subscribe(idValue => {
    //   this.productService.verifyIdExists(idValue).subscribe((exists) => {
    //     if (exists) {
    //       this.productForm.get('id')?.setErrors({ idExists: true });
    //     } else {
    //       // Quitar el error si no existe
    //       const errors = this.productForm.get('id')?.errors || {};
    //       delete errors['idExists'];
    //       this.productForm.get('id')?.setErrors(Object.keys(errors).length ? errors : null);
    //     }
    //   });
    // });
  }

  /**
   * Validación personalizada para:
   * - Fecha de liberación >= hoy
   * - Fecha de revisión = 1 año posterior a la liberación
   */
  validateDates(control: AbstractControl): null {
    const releaseDateControl = control.get('releaseDate');
    const revisionDateControl = control.get('revisionDate');

    if (!releaseDateControl || !revisionDateControl) return null;

    const releaseDate = new Date(releaseDateControl.value);
    const revisionDate = new Date(revisionDateControl.value);
    const today = new Date(); // hoy sin horas/minutos/segundos
    today.setHours(0, 0, 0, 0);

    // Validar que releaseDate >= hoy
    if (releaseDate < today) {
      releaseDateControl.setErrors({invalidRelease: true});
    }

    // Validar que revisionDate = releaseDate + 1 año
    const oneYearAfter = new Date(releaseDate);
    oneYearAfter.setFullYear(oneYearAfter.getFullYear() + 1);

    // Comparación de fechas
    if (revisionDate.getTime() !== oneYearAfter.getTime()) {
      revisionDateControl.setErrors({invalidRevision: true});
    }

    return null;
  }

  /**
   * Método para verificar si un campo está inválido y tocado,
   * con el fin de asignar la clase .error al contenedor.
   */
  isFieldInvalid(fieldName: string): boolean {
    const field = this.productForm.get(fieldName);
    return !!field && field.invalid && (field.dirty || field.touched);
  }

  /**
   * Acción al enviar el formulario
   */
  onSubmit(): void {
    if (this.productForm.valid) {
      console.log('Formulario válido:', this.productForm.value);
      // Llamar al servicio para guardar el producto
      // this.productService.createProduct(this.productForm.value).subscribe(...);
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      this.productForm.markAllAsTouched();
      console.log('Formulario inválido');
    }
  }

  /**
   * Reiniciar el formulario
   */
  onReset(): void {
    this.productForm.reset();
  }
}
