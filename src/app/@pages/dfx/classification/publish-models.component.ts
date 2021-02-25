import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { DfxRoutes } from 'src/app/routes/name.routes';
import { ClassificationService } from 'src/app/services/classification.services';
import { NgxSpinnerService } from "ngx-spinner";
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-publish',
  templateUrl: './publish-models.view.html',
})
export class ClassificationPublishModelsComponent implements OnInit {
  @ViewChild('confirmation') confirmation;
  dataLoader = false;
  longWait = false;
  apiRespondError = false;
  dataLoaderP = false;
  longWaitP = false;
  apiRespondErrorP = false;
  config: any;
  classificationModelPath = DfxRoutes.ClassificationModels;
  classificationBuildModelPath = DfxRoutes.ClassificationBuildModels;
  classificationPublishModelPath = DfxRoutes.ClassificationPublishModels;
  NewModel = false;
  ExModel = true;
  groupsListShow = true;
  editModelShow = false;
  unTrainedGroups: any = [];
  readyToPublishGroups: any = [];
  message: { message: string; cancel: string; trigger: string };
  confirmationVisible: boolean;
  group: any;
  fullModel: any = [];
  modelTypes: any = [];
  totalModels: any = [];
  modelTyped: any;
  modelsub: any;
  model: any;
  searching = false;
  searchFailed = false;
  modelData: FormGroup;
  subTypeSelect: any = [];
  selectClass: any;
  alertVisible = false;
  alertData: { message: string; type: string };
  submitted = false;

  hightlightStatus: Array<boolean> = [];
  selectedGroup: any[] = [];
  triggerMethod: string;
  apiAccessError = false;
  apiAccessErrorP = false;

  trainingSuccess = false;
  trainingfailed = false;
  trainingrunning = false;
  publishSuccess = false;
  publishfailed = false;
  publishrunning = false;
  randomDoc: any = {};
  file = { filePath: '' };
  showModalBox: boolean = false;

  constructor(
    public classService: ClassificationService,
    private formBuilder: FormBuilder,  
    private SpinnerService: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.classService.shown = false;
    this.getTrainingGroupsList();
    this.getPublishGroupsList();
    this.getTrainPublishStatus();

    this.classService.readModelsListDb().subscribe((data) => {
      this.fullModel = [...new Set(data.map((models) => models.model))];
      this.modelTypes = [...new Set(data.map((models) => models.parent))];
      this.totalModels = data;
    });

    this.modelData = this.formBuilder.group({
      subType: ['', [Validators.required, Validators.minLength(3)]],
      Type: ['', [Validators.required, Validators.minLength(3)]],
      childType: [''],
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
      map((term) =>
        this.fullModel
          .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
          .slice(0, 10)
      )
    )

  modelType = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map((term) =>
        this.modelTypes
          .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
          .slice(0, 10)
      )
    )

  searchSub = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map((term) => [
        ...new Set(
          this.totalModels
            .filter((data) => data.parent === this.modelTyped)
            .map((models) => models.model)
            .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
        ),
      ])
    )

  getTrainPublishStatus() {
    forkJoin(
      [this.classService.trainingStatus(),
      this.classService.publishList()]
    ).subscribe(
      ([training, publish]: any) => {
        if (training === 1) {
          this.trainingrunning = true;
        } else if (training === 0) {
          this.trainingfailed = true;
        } else if (training === -1) {
          this.trainingSuccess = true;
        } else if (publish === 1) {
          this.publishrunning = true;
        } else if (publish === 0) {
          this.publishfailed = true;
        } else if (publish === -1) {
          this.publishSuccess = true;
        }
      },
      (error) => {
        this.apiRespondError = true;
        this.apiRespondError = true;
        if (error.status === 403) {
          this.apiAccessError = true;
        }
      });
  }

  getTrainingGroupsList() {
    this.dataLoader = true;
    if (this.dataLoader) {
      setTimeout(() => {
        this.longWait = true;
      }, 20000);
    }
    this.classService.readTrainingGroupsList().subscribe(
      (response: any) => {
        this.longWait = false;
        this.dataLoader = false;
        this.unTrainedGroups = response;
      },
      (error) => {
        this.apiRespondError = true;
        this.apiRespondError = true;
        if (error.status === 403) {
          this.apiAccessError = true;
        }
      }
      );
  }
  getPublishGroupsList() {
    if (!(this.dataLoader || this.apiRespondError)) {
      this.dataLoaderP = true;
      if (this.dataLoaderP) {
        setTimeout(() => {
          this.longWaitP = true;
        }, 20000);
      }
    }
    this.classService.readPublishGroupsList().subscribe(
      (response: any) => {
        this.longWaitP = false;
        this.dataLoaderP = false;
        this.readyToPublishGroups = response;
      },
      (error) => {
        if (!this.apiRespondError) {
          this.apiRespondErrorP = true;
        }
        this.apiRespondError = true;
        if (error.status === 403) {
          this.apiAccessErrorP = true;
        }
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
  }

  pusblishModel() {
    this.triggerMethod = 'publish';
    this.message = {
      message: 'Are you sure want to publish all models?',
      cancel: 'Cancel',
      trigger: 'Proceed',
    };
    this.confirmationVisible = true;
  }

  getRandomDocs(key: any) {
    this.classService.readGroupsDocsList(key.group_id).subscribe(
      (response: any) => {
        this.longWait = false;
        this.dataLoader = false;
        this.randomDoc = response;
      },
      error => {
        this.apiRespondError = true;
      }
    );
  }

  selectModelforTraining(a: any, group: any) {
    this.getRandomDocs(group);
    if (!this.trainingrunning) {
      this.hightlightStatus[a] = !this.hightlightStatus[a];
      this.selectedGroup =
        [...this.selectedGroup, group.group_id].filter(
          (data) => data === group.group_id
        ).length === 2
          ? this.selectedGroup.filter((data) => data !== group.group_id)
          : [...this.selectedGroup, group.group_id];
    }
  }

  trainModel() {
    this.triggerMethod = 'training';
    this.message = {
      message: `Are you sure want initiate training for ?`,
      cancel: 'Cancel',
      trigger: 'Proceed',
    };
    this.confirmationVisible = true;
  }

  cancelConfirm() {
    this.confirmationVisible = false;
  }
  Trigger(Trigger: any) {
    this.confirmationVisible = false;
    switch (Trigger) {
      case 'training':
        const trainObj = {
          group_id: this.selectedGroup,
        };
        this.classService.trainingModel(trainObj).subscribe(
          (response: any) => {
            this.selectedGroup = [];
            this.alertVisible = true;
            this.alertData = {
              message: `Models Training Started`,
              type: 'info',
            };
            this.getTrainingGroupsList();
            this.getTrainPublishStatus();
          },
          (err) => console.log(err)
        );
        break;
      case 'publish':
        const publishObj = {
          group_id: this.readyToPublishGroups.map((data) => data.group_no),
        };
        this.classService.publishModel(publishObj).subscribe(
          (response: any) => {
            this.alertVisible = true;
            this.alertData = {
              message: `Publishing models initiated`,
              type: 'info',
            };
            this.getPublishGroupsList();
            this.getTrainPublishStatus();
          },
          (err) => console.log(err)
        );
        break;
    }
  }
  // trainTrigger() {
  //   this.confirmationVisible = false;
  // }

  buildModelform(group: any) {
    this.submitted = false;
    this.groupsListShow = false;
    this.editModelShow = true;
    this.subTypeSelect = this.totalModels;

    this.group = group;
    this.model = group.type;
    this.modelData.controls.subType.setValue(group.model);
    this.modelData.controls.childType.setValue(group.child);
  }

  closeBuildModelform() {
    this.groupsListShow = true;
    this.editModelShow = false;
    this.NewModel = false;
    this.ExModel = true;
  }

  get f() {
    return this.modelData.controls;
  }

  buildModel(group: any) {
    this.submitted = true;
    const modelDataJson = {
      parent: this.modelData.value.Type,
      model: this.modelData.value.subType,
      child: this.modelData.value.childType,
      group_id: group.group_id,
    };
    this.classService.updateModel(modelDataJson).subscribe(
      (data) => {
        this.alertVisible = true;
        this.alertData = {
          message: `Model Updated successfully`,
          type: 'success',
        };
        this.modelData.reset();
        this.groupsListShow = true;
      },
      (error) => {
        this.alertVisible = true;
        this.alertData = { message: `Something went wrong`, type: 'error' };
        this.apiRespondError = true;
        if (error.status === 403) {
          this.apiAccessError = true;
        }
      }
    );
  }

  cancel() {
    this.alertVisible = false;
  }

  revokeModel(group: any) {
    const modelID = {
      group_id: group.group_id ? group.group_id : group.group_no,
    };
    this.classService.revokeModel(modelID).subscribe(
      (response: any) => {
        this.alertVisible = true;
        this.alertData = {
          message: `Model Revoked successfully`,
          type: 'success',
        };
        this.modelData.reset();
        this.groupsListShow = true;
        this.editModelShow = false;
        this.getTrainingGroupsList();
        this.getPublishGroupsList();
      },
      (error) => {
        this.alertVisible = true;
        this.alertData = { message: `Something went wrong`, type: 'error' };
        this.apiRespondError = true;
        if (error.status === 403) {
          this.apiAccessError = true;
        }
      }
    );
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
