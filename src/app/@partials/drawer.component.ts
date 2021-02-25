import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClassificationService } from '../services/classification.services';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.view.html'
})
export class DrawerComponent implements OnInit {
  @Input() visible: boolean;
  @Input() subDrawer = { docShow: false, docSlide: '', selectedIndex: null};
  @Input() subModelDoc: any;
  @Input() subModel: any;
  @Input() drawerWidth: any;
  @Output() drOnClose = new EventEmitter();
  @Output() showDoc = new EventEmitter();
  @Output() hideDoc = new EventEmitter();
  fade: string;
  slide: string;
  config: any;
  dataLoader = false;
  longWait = false;
  apiRespondError = false;
  dataDrawDocLoader = false;
  longDrawDocWait = false;
  apiDrawDocRespondError = false;

  file = { filePath: '' };

  constructor(
    public classService: ClassificationService,  
    private SpinnerService: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.fade = 'fadeIn';
    this.slide = 'slideInRight';
    this.subDrawer.docSlide = 'slideInRight';
    this.classService.shown = false;
  }

  drOnClosed() {
    this.fade = 'fadeOut';
    this.slide = 'slideOutRight';
    this.subDrawer.docSlide = 'slideOutRight';
    setTimeout(() => {
      this.visible = false;
      this.subDrawer.docShow = false;
      this.drOnClose.emit();
    }, 1000);
  }
  closeDocShow() {
    this.subDrawer.docSlide = 'slideOutRight';
    setTimeout(() => {
      this.subDrawer.docShow = false;
      this.hideDoc.emit();
    }, 1000);
  }

  /* To copy any Text */
  copyText(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  fileEvent(url) {
    try{
    this.file.filePath = url;
    this.SpinnerService.show(); 
    this.classService.getFile(this.file).then((response: any) => {
      let contentType=response.headers.get('Content-Type');
      let blob=response.body;
      console.log(contentType)
      if(blob.size>0){
      blob.lastModifiedDate = new Date();
        var iframe:any = document.createElement("iframe");
        var modifiedBlob = new Blob([blob], {type: contentType});
        var fileURL = URL.createObjectURL(modifiedBlob);
        var h=500;
        var w=800;
        var t = window.outerHeight / 2 + window.screenY - ( h / 2);
        var l = window.outerWidth / 2 + window.screenX - ( w / 2);
        console.log(blob);
        if(contentType==="content/unknown"){
        this.SpinnerService.hide();
        window.location.href = fileURL;
        }else{
        this.SpinnerService.hide();
        var newWindow = window.open(iframe, 'Dynamic Popup', 'height='+h+', width='+w+',top='+t+', left='+l+' scrollbars=auto, resizable=no, location=no, status=no');
        if(newWindow!=null){
          newWindow.document.write('<iframe width=100% height=100% src='+fileURL+' allowfullscreen></iframe>');
        }else console.error("Pop up might be blocked")
        }
    } else return;
    }, (err) => {
      this.SpinnerService.hide();
      if (err.status == 404) console.error("File not found");
      if (err.status == 400) console.error("IO Exception");
      if (err.status == 500) console.error(err);
    });
  } catch(err){
    this.SpinnerService.hide();
    console.log(err);
  }
  }
}
