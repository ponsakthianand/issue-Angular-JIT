import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import { Moment } from 'moment';
// import * as moment from 'moment';
import * as moment from 'moment-timezone';
import { DfxRoutes } from 'src/app/routes/name.routes';
import { DmsService } from 'src/app/services/dms.services';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-hub',
  templateUrl: './hub-landing.view.html',
  providers: [DatePipe],
})
export class HubComponent implements OnInit {
  config: any;
  public formUrl: SafeResourceUrl;

  formList: any = [];
  employeeData: any;
  defaultLanding = true;
  LoadForm = false;
  iframeData: any = [];
  tasks: any = [];
  todayTask: any = [];
  yesterdayTask: any = [];
  WeekTask: any = [];
  monthTask: any = [];
  oldTask: any = [];
  loadTask = false;
  loadForm = false;

  hubLandingPath = DfxRoutes.hubLanding;
  currentUsername: any;
  isFormOpen: NodeJS.Timeout;
  currentUsernamefull: string;

  localClock: any;
  genevaClock: any;
  jerseyClock: any;
  public time: Date = new Date();
  absenceData: any;
  header = [];
  datas = [];

  constructor(
    public dmsService: DmsService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    $('body')
      .removeClass('success')
      .removeClass('fail')
      .addClass('app-calendar');

    // this.currentUsername = ('DATAFABRICX\\dfxadmin'.replace(/\\/g, '%5C'));
    this.currentUsername = localStorage
      .getItem('username')
      .replace(/\\/g, '%5C');
    this.currentUsernamefull = localStorage.getItem('username');
    this.getFormsData();
    this.getTaskData(this.currentUsernamefull);
    this.getEmployeeData(this.currentUsernamefull);
    this.getAbsenseDetails();

    setInterval(() => {
      this.getFormsData();
      this.getTaskData(this.currentUsernamefull);
      this.getEmployeeData(this.currentUsernamefull);
    }, 300000);
    setInterval(() => {
      this.time = new Date();
      const timezone = 'America/Los_Angeles';
      this.localClock = this.time;
      this.genevaClock = moment.tz('Europe/Zurich').format('hh:mm a');
      this.jerseyClock = moment.tz('Europe/Jersey').format('hh:mm a');
    }, 1000);
  }

  getAbsenseDetails() {
    this.dmsService.getAbsenceData().subscribe((response: any) => {
      this.absenceData = response;
      const absObj = this.absenceData.map((data) => data.jurisdiction);
      this.header = [...new Set(absObj)];
    });
  }

  reloadData() {
    this.getFormsData();
    this.getTaskData(this.currentUsernamefull);
    this.getEmployeeData(this.currentUsernamefull);
  }

  getFormsData() {
    clearInterval(this.isFormOpen);
    this.loadForm = true;
    this.dmsService
      .getFormsList(this.currentUsernamefull)
      .subscribe((data: any) => {
        this.loadForm = false;
        this.formList = data;
      });
  }

  getEmployeeData(id) {
    this.dmsService.getEmployeeData(id).subscribe((data: any) => {
      this.employeeData = data;
      console.log(data);
    });
  }

  getTaskData(username) {
    this.loadTask = true;
    this.dmsService.getTaskList(username).subscribe((data) => {
      this.loadTask = false;
      $('.AllFilter').addClass('active').siblings().removeClass('active');
      if (data.status === 204) {
        this.tasks = [];
      } else {
        this.tasks = data;
      }
    });
  }

  filterSecs(filter: any) {
    const tday = new Date().getDate();
    const yday = new Date().getDate() - 1;
    const lmonth = new Date().getMonth();

    switch (filter) {
      case 'TodayFilter':
        $('.TodayFilter').addClass('active').siblings().removeClass('active');
        this.loadTask = true;
        this.dmsService.getTaskList(this.currentUsername).subscribe((data) => {
          this.loadTask = false;

          this.tasks = data.filter((data) => {
            if (new Date(data.start_date).getDate() === tday) {
              return data;
            }
          });
        });
        break;
      case 'YesterdayFilter':
        $('.YesterdayFilter')
          .addClass('active')
          .siblings()
          .removeClass('active');
        this.dmsService.getTaskList(this.currentUsername).subscribe((data) => {
          this.loadTask = false;
          this.tasks = data.filter((data) => {
            if (new Date(data.start_date).getDate() === yday) {
              return data;
            }
          });
        });
        break;
      case 'WeekFilter':
        $('.WeekFilter').addClass('active').siblings().removeClass('active');
        this.dmsService.getTaskList(this.currentUsername).subscribe((data) => {
          this.loadTask = false;
          this.tasks = data.filter((data) => {
            if (
              moment(new Date(data.start_date)).week() ===
              moment(new Date()).week()
            ) {
              return data;
            }
          });
        });
        break;
      case 'MonthFilter':
        $('.MonthFilter').addClass('active').siblings().removeClass('active');
        this.dmsService.getTaskList(this.currentUsername).subscribe((data) => {
          this.loadTask = false;
          this.tasks = data.filter((data) => {
            if (new Date(data.start_date).getMonth() === lmonth) {
              return data;
            }
          });
        });
        break;
      case 'OlderFilter':
        $('.OlderFilter').addClass('active').siblings().removeClass('active');
        this.dmsService.getTaskList(this.currentUsername).subscribe((data) => {
          this.loadTask = false;
          this.tasks = data.filter((data) => {
            if (
              !(new Date(data.start_date).getMonth() === lmonth) &&
              !(
                moment(new Date(data.start_date)).week() ===
                  moment(new Date()).week() &&
                !(new Date(data.start_date).getDate() === yday) &&
                !(new Date(data.start_date).getDate() === tday)
              )
            ) {
              return data;
            }
          });
          console.log(this.tasks);
        });
        break;
      case 'AllFilter':
        $('.AllFilter').addClass('active').siblings().removeClass('active');
        this.dmsService.getTaskList(this.currentUsername).subscribe((data) => {
          this.loadTask = false;
          this.tasks = data;
        });
        break;
    }
  }
  getTaskByDate() {
    this.loadTask = true;
    const tday = new Date().getDate();
    const yday = new Date().getDate() - 1;
    const lmonth = new Date().getMonth();
    this.dmsService.getTaskList(this.currentUsername).subscribe((data) => {
      this.loadTask = false;
      this.todayTask = data.filter((data) => {
        if (new Date(data.start_date).getDate() === tday) {
          return data;
        }
      });
      this.yesterdayTask = data.filter((data) => {
        if (new Date(data.start_date).getDate() === yday) {
          return data;
        }
      });
      this.WeekTask = data.filter((data) => {
        if (
          moment(new Date(data.start_date)).week() === moment(new Date()).week()
        ) {
          return data;
        }
      });
      this.monthTask = data.filter((data) => {
        if (new Date(data.start_date).getMonth() === lmonth) {
          return data;
        }
      });
      // this.oldTask = data.filter((data) => {
      //   if (!(new Date(data.start_date).getMonth() === lmonth) &&
      // !(moment(new Date(data.start_date)).week() === (moment(new Date()).week()) &&
      //   !(new Date(data.start_date).getDate() === yday) &&
      //   !(new Date(data.start_date).getDate() === tday))) {
      //     return data;
      //   }
      // });
    });
  }
  loadiFrame(obj) {
    this.iframeData = obj;
    if (obj.targetIsBlank) {
      window.open(obj.url ? obj.url : obj.resume_id, '_blank');
    } else {
      this.defaultLanding = false;
      this.LoadForm = true;
      this.formUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        obj.url ? obj.url : obj.resume_id
      );
      if (obj.task_id) {
        this.isFormOpen = setInterval(() => {
          this.dmsService.getFormActiveState(obj.task_id).subscribe((data) => {
            if (!data) {
              this.getTaskData(this.currentUsernamefull);
              this.defaultLanding = true;
              this.LoadForm = false;
              this.formUrl = '';
              this.iframeData = [];
              clearInterval(this.isFormOpen);
            }
          });
        }, 3000);
      }
    }
  }
  closeForm() {
    this.getTaskData(this.currentUsernamefull);
    this.getFormsData();
    this.getEmployeeData(this.currentUsernamefull);
    this.defaultLanding = true;
    this.LoadForm = false;
    this.formUrl = '';
    this.iframeData = [];
  }
}
