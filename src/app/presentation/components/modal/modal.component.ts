import {Component, input, output} from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {
  message = input<string>();
  onConfirm = output();
  onClose = output();

  confirm(): void {
    this.onConfirm.emit();
  }

  cancel(): void {
    this.onClose.emit();
  }
}
