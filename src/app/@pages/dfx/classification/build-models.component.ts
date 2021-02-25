import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { DfxRoutes } from 'src/app/routes/name.routes';
import { ClassificationService } from 'src/app/services/classification.services';
import { NgxSpinnerService } from "ngx-spinner";
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-buildmodels',
  templateUrl: './build-models.view.html'
})
export class ClassificationBuildModelsComponent implements OnInit {
  dataLoader = false;
  longWait = false;
  apiRespondError = false;
  config: any;
  classificationModelPath = DfxRoutes.ClassificationModels;
  classificationBuildModelPath = DfxRoutes.ClassificationBuildModels;
  classificationPublishModelPath = DfxRoutes.ClassificationPublishModels;
  ExModel = true;
  NewModel = false;
  groupsListShow = true;
  buildModelShow = false;
  groupsList: any = [];
  group: any;
  modelData: FormGroup;
  Subtype: any = [];
  subTypeSelect: any = [];

  model: any;
  searching = false;
  searchFailed = false;

  fullModel: any = [];
  modelTypes: any = [];
  totalModels: any = [];
  modelTyped: any;
  modelsub: any;
  randomDoc: any = {};
  alertVisible = false;
  alertData: { message: string; type: string };
  submitted = false;
  apiAccessError = false;
  file = { filePath: '' };

  constructor(
    public classService: ClassificationService,
    private formBuilder: FormBuilder,  
    private SpinnerService: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.getGroupsList();
    this.classService.shown = false;
    this.classService.getModelSubType().subscribe(data => {
      this.Subtype = data;
    });

    this.classService.readModelsListDb().subscribe(data => {
      this.fullModel = [...new Set(data.map(models => models.model))];
      this.modelTypes = [...new Set(data.map(models => models.parent))];
      this.totalModels = data;
    });

    this.modelData = this.formBuilder.group({
      subType: [null, [Validators.required, Validators.minLength(3)]],
      Type: ['', [Validators.required, Validators.minLength(3)]],
      childType: ['']
    });
  }

  get showdata() {
    return localStorage.getItem('showmenu') === 'true';
  }

  get showadmin() {
    return localStorage.getItem('showadmin') === 'true';
  }

  get showanalyst() {
    return localStorage.getItem('showanalyst') === 'true';
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map(term =>
        this.fullModel
          .filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
          .slice(0, 10)
      )
    )

  modelType = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map(term =>
        this.modelTypes
          .filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
          .slice(0, 10)
      )
    )

  searchSub = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map(term => [
        ...new Set(
          this.totalModels
            .filter(data => data.parent === this.modelTyped)
            .map(models => models.model)
            .filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
        )
      ])
    )

  getGroupsList() {
    this.dataLoader = true;
    if (this.dataLoader) {
      setTimeout(() => {
        this.longWait = true;
      }, 20000);
    }
    this.classService.readGroupsList().subscribe(
      (response: any) => {
        this.longWait = false;
        this.dataLoader = false;
        this.groupsList = response;
        console.log(this.groupsList)
      },
      error => {
        this.apiRespondError = true;
      }
    );
  }

  newModel() {
    this.NewModel = true;
    this.ExModel = false;
  }

  closeNewModel() {
    this.NewModel = false;
    this.ExModel = true;
    this.modelData.reset();
  }

  buildModelform(key: any) {
    this.submitted = false;
    this.groupsListShow = false;
    this.buildModelShow = true;
    this.group = key;
    this.getRandomDocs(key);
    this.subTypeSelect = this.totalModels;
  }

  getRandomDocs(key: any) {
    this.classService.readGroupsDocsList(key.group_id).subscribe(
      (response: any) => {
        this.longWait = false;
        this.dataLoader = false;
        this.randomDoc = response;
        console.log(this.randomDoc)
      },
      error => {
        this.apiRespondError = true;
      }
    );
  }

  closeBuildModelform() {
    this.modelData.reset();
    this.groupsListShow = true;
    this.buildModelShow = false;
    this.NewModel = false;
    this.ExModel = true;
  }
  addCustomModelType = term => ({ id: term, value: term });

  get f() {
    return this.modelData.controls;
  }

  buildModel(group: any) {
    this.submitted = true;
    const modelDataJson = {
      parent:
      this.modelData.value.Type ||
      this.subTypeSelect.filter(
        data => data.model === this.modelData.value.subType
        )[0].parent,
        model: this.modelData.value.subType,
        child: this.modelData.value.childType,
        group_id: group.group_id
    };

    // if (this.modelData.valid) {
    this.classService.saveModel(modelDataJson).subscribe(
      data => {
        this.alertVisible = true;
        this.alertData = {
          message: `Model Created successfully`,
          type: 'success'
        };
        this.modelData.reset();
        this.groupsListShow = true;
        this.buildModelShow = false;
        this.getGroupsList();
      },
      error => {
        this.alertVisible = true;
        this.alertData = { message: `Something went wrong`, type: 'error' };
      }
    );
    // }
  }

  cancel() {
    this.alertVisible = false;
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
