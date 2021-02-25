import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-lae',
  templateUrl: './loading-and-error.view.html'
})
export class LoadingAndErrorComponent implements OnInit {
  @Input() dataLoader: boolean;
  @Input() apiRespondError: boolean;
  @Input() apiAccessError: boolean;
  @Input() longWait: boolean;
  ngOnInit() { }
}
