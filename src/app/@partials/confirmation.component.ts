import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.view.html'
})
export class ConfirmationComponent implements OnInit {
  @Input() message = {message: '', cancel: '', trigger: ''};
  @Output() cancel = new EventEmitter();
  @Output() trigger = new EventEmitter();
  @Input() confirmationVisible: boolean;
  fade: string;
  slide: string;
  ngOnInit() {
    this.fade = 'fadeIn';
    this.slide = 'slideInDown';
  }

  clickCancel() {
    this.fade = 'fadeOut';
    this.slide = 'slideOutUp';
    setTimeout(() => {
      this.confirmationVisible = false;
      this.cancel.emit();
    }, 1000);
  }

  clickTrigger() {
    this.fade = 'fadeOut';
    this.slide = 'slideOutUp';
    setTimeout(() => {
      this.confirmationVisible = false;
      this.trigger.emit();
    }, 1000);
  }
}
