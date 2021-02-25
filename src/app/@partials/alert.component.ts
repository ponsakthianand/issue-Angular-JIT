import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-alert',
  templateUrl: './alert.view.html'
})
export class AlertComponent implements OnInit {
  @Input() alertData = { message: '', type: '' };
  @Output() cancel = new EventEmitter();
  @Input() alertVisible: boolean;
  ngOnInit() {}

  closeAlert() {
    this.cancel.emit();
    this.alertVisible = false;
  }
}
