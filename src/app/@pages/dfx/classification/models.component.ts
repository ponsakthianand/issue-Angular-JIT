import { Component, OnInit } from '@angular/core';
import { DfxRoutes } from 'src/app/routes/name.routes';
import { ClassificationService } from 'src/app/services/classification.services';
import { Router } from '@angular/router';
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-models',
  templateUrl: './models.view.html',
})
export class ClassificationModelsComponent implements OnInit {
  dataLoader = false;
  longWait = false;
  apiRespondError = false;
  dataDrawLoader = false;
  longDrawWait = false;
  apiDrawRespondError = false;
  dataDrawDocLoader = false;
  longDrawDocWait = false;
  apiDrawDocRespondError = false;
  config: any;
  visible = false;
  classificationModelPath = DfxRoutes.ClassificationModels;
  classificationBuildModelPath = DfxRoutes.ClassificationBuildModels;
  classificationPublishModelPath = DfxRoutes.ClassificationPublishModels;
  modelGroupsName: any = [];
  modelGroups: any = [];
  public isCollapsed = false;
  DocList: any;
  totalDocs: any;
  parent: any;
  docsCount: any;
  subModelDoc: any;
  subModel: any;
  subDrawer = { docShow: false, docSlide: '', selectedIndex: null };
  apiAccessError = false;

  constructor(public classService: ClassificationService, private routes: Router) {}

  ngOnInit() {
    this.getModelsList();
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

  filterModel(dataSet, alphabet) {
    return Array.from(
      new Set(
        dataSet
          .map((item) => item[alphabet])
          .filter((data) => !['', null].includes(data))
      )
    );
  }

  getModelsList() {
    this.dataLoader = true;
    if (this.dataLoader) {
      setTimeout(() => {
        this.longWait = true;
      }, 20000);
    }
    this.classService.readModelsList().subscribe(
      (response: any) => {
        this.longWait = false;
        this.dataLoader = false;
        this.modelGroupsName = [
          ...new Set(response.map((data) => data.model.charAt(0))),
        ];
        this.modelGroups = this.modelGroupsName.map((data, index) => ({
          label: data,
          selected: false,
          groups: response.filter((keyd) => keyd.model.charAt(0) === data),
        }));
        this.modelGroups
          .sort((a, b) => a.label.localeCompare(b.label))
          .forEach((element, index) => {
          });
      },
      (error) => {
        this.apiRespondError = true;
        if (error.status === 403) {
          this.apiAccessError = true;
        }
      }
    );
  }
  open(id: any, group: any) {
    this.dataDrawLoader = true;
    if (this.dataDrawLoader) {
      setTimeout(() => {
        this.longDrawWait = true;
      }, 20000);
    }
    this.visible = true;
    this.parent = group;
    this.classService.readModelData(group.model, group.parent).subscribe(
      (data: any) => {
        this.longDrawWait = false;
        this.dataDrawLoader = false;
        this.totalDocs = data.total_model_count;
        this.docsCount = data.child_groups.length;
        this.DocList = data.child_groups; // .filter(data => data.child !== '');
      },
      (error) => {
        this.apiDrawRespondError = true;
        this.apiRespondError = true;
        if (error.status === 403) {
          this.apiAccessError = true;
        }
      }
    );
  }

  openSubModelDoc(model: any, subModel: any, index: any) {
    this.dataDrawDocLoader = true;
    if (this.dataDrawDocLoader) {
      setTimeout(() => {
        this.longDrawDocWait = true;
      }, 20000);
    }
    this.subDrawer.docShow = true;
    this.subDrawer.selectedIndex = index;
    this.subDrawer.docSlide = 'slideInRight';
    this.subModel = subModel;
    this.classService
      .readModelSubTypeDoc(model.model_id, subModel.child_id)
      .subscribe(
        (data: any) => {
          this.longDrawDocWait = false;
          this.dataDrawDocLoader = false;
          this.subModelDoc = data;
        },
        (error) => {
          this.apiDrawDocRespondError = true;
          this.apiRespondError = true;
          if (error.status === 403) {
            this.apiAccessError = true;
          }
        }
      );
  }
  closeDocShow() {
    this.subDrawer.docShow = false;
  }

  close() {
    this.visible = false;
  }
}
