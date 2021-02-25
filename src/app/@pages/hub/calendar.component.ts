import { HostListener, Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput, Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import { DmsService } from 'src/app/services/dms.services';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { DfxRoutes } from 'src/app/routes/name.routes';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar.view.html',
  providers: [DatePipe]
})
export class HubCalendarComponent implements OnInit {
  config: any;
  calendarPlugins = [dayGridPlugin, timeGrigPlugin]; // important!
  leaveData: any = [];
  departmentList: any = [];
  myDate = new Date();
  employeeData: any;
  employeeUserId: any;
  hubLandingPath = DfxRoutes.hubLanding;
  showClass: Array<boolean> = [];
  visible = false;
  subModelDoc: any;
  subModel: any;
  subDrawer = { docShow: false, docSlide: '', selectedIndex: null };
  eventInfo: {
    department: any,
    employeeName: any,
    fromDate: any,
    fullDetail: any,
    leaveType: any,
    reason: any,
    toDate: any
  };
  eventListener: any;
  entryId: any;
  alertVisible = false;
  alertData: { message: string; type: string };
  defaultLanding = true;
  LoadForm = false;
  public formUrl: SafeResourceUrl;
  iframeLink: any;
  iframeData: any = [];
  eventEmployeeId: any;
  empId: any;
  currentUsername: string;
  currentUsernamefull: string;


  constructor(
    public dmsService: DmsService,
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) {}


  ngOnInit() {
    $('body').removeClass('success').removeClass('fail').addClass('app-calendar');
    this.currentUsername = localStorage.getItem('username').replace(/\\/g, '%5C');
    this.currentUsernamefull = localStorage.getItem('username');
    this.getEmployeeData(this.currentUsernamefull);

    setInterval(() => {
      this.getEmployeeData(this.currentUsernamefull);
    }, 300000);
  }
  reloadData() {
    this.getEmployeeData(this.currentUsernamefull);
  }

  getEmployeeData(id) {
    this.dmsService.getEmployeeData(id).subscribe((data: any) => {
      this.employeeData = data;
      this.getCalendarData(this.employeeData.user_Id);
      this.employeeUserId = this.employeeData.user_Id;
    });
  }

  handleDateClick(date, id) { // handler method
    $('.allDepart').addClass('show');
    $('.filterDepart').removeClass('show');
    const month = date.view.title;
    const monthNumber = date.view.title.split(' ')[0];
    const yearNumber = date.view.title.split(' ')[1];
    this.dmsService.getCalendarData(yearNumber + '-' + monthNumber + '-01', id).subscribe((data: any) => {
      this.leaveData = data.map((event) => ({
        entryId: event.entryId,
        title: event.employeeName + '-' + event.leaveType + '-' + event.reason,
        start: event.fromDate,
        end: event.toDate,
        department: event.department,
        description: {
          department: event.department,
          employeeName: event.employeeName,
          fromDate: event.fromDate,
          fullDetail: event.fullDetail,
          leaveType: event.leaveType,
          reason: event.reason,
          toDate: event.toDate
        }
      }));
      const departmentOnly = this.leaveData.map(data => data.department);
      this.departmentList = departmentOnly.filter((x, i, a) => x && a.indexOf(x) === i);
    });
    this.eventListener = date;
  }

  eventClick(data) {
    this.visible = true;
    this.entryId = data.event._def.extendedProps.entryId;
    this.eventInfo = data.event._def.extendedProps.description;
    this.eventEmployeeId = data.event._def.defId;
    console.log(data);
  }
  getCalendarData(id) {
    $('.allDepart').addClass('show');
    $('.filterDepart').removeClass('show');
    this.dmsService.getCalendarData(this.datePipe.transform(this.myDate, 'yyyy-MM-dd'), id).subscribe((data: any) => {
      this.leaveData = data.map((event) => ({
        entryId: event.entryId,
        title: event.employeeName + '-' + event.leaveType + '-' + event.reason,
        start: event.fromDate,
        end: event.toDate,
        department: event.department,
        description: {
          department: event.department,
          employeeName: event.employeeName,
          fromDate: event.fromDate,
          fullDetail: event.fullDetail,
          leaveType: event.leaveType,
          reason: event.reason,
          toDate: event.toDate
        },
      }));
      console.log(this.leaveData)
      const departmentOnly = this.leaveData.map(data => data.department);
      this.departmentList = departmentOnly.filter((x, i, a) => x && a.indexOf(x) === i);
    });
  }

  allDepartmentData(id) {
    $('.allDepart').addClass('show');
    $('.filterDepart').removeClass('show');
    const date = this.eventListener;
    const month = date.view.title;
    const monthNumber = date.view.title.split(' ')[0];
    const yearNumber = date.view.title.split(' ')[1];
    this.dmsService.getCalendarData(yearNumber + '-' + monthNumber + '-01', id).subscribe((data: any) => {
      this.leaveData = data.map((event) => ({
        entryId: event.entryId,
        title: event.employeeName + '-' + event.leaveType + '-' + event.reason,
        start: event.fromDate,
        end: event.toDate,
        department: event.department,
        description: {
          department: event.department,
          employeeName: event.employeeName,
          fromDate: event.fromDate,
          fullDetail: event.fullDetail,
          leaveType: event.leaveType,
          reason: event.reason,
          toDate: event.toDate
        }
      }));
      const departmentOnly = this.leaveData.map(data => data.department);
      this.departmentList = departmentOnly.filter((x, i, a) => x && a.indexOf(x) === i);
    });
  }
  filterDepartment(depart, id) {
    this.showClass = depart;
    $('.allDepart').removeClass('show');
    $('.filterDepart').removeClass('show');
    const date = this.eventListener;
    const month = date.view.title;
    const monthNumber = date.view.title.split(' ')[0];
    const yearNumber = date.view.title.split(' ')[1];
    this.dmsService.getCalendarData(yearNumber + '-' + monthNumber + '-01', id).subscribe((data: any) => {
      this.leaveData = data.map((event) => ({
        entryId: event.entryId,
        title: event.employeeName + '-' + event.leaveType + '-' + event.reason,
        start: event.fromDate,
        end: event.toDate,
        department: event.department,
        description: {
          department: event.department,
          employeeName: event.employeeName,
          fromDate: event.fromDate,
          fullDetail: event.fullDetail,
          leaveType: event.leaveType,
          reason: event.reason,
          toDate: event.toDate
        }
      })).filter(tt => tt.department === depart);
    });
  }

  // deleteLeaveData(entryId) {
  //   this.dmsService.deleteLeave(entryId).subscribe((data: any) => {
  //     this.alertVisible = true;
  //     this.alertData = { message: 'Deleted Successfully!', type: 'success' };
  //     setTimeout(() => {
  //       this.alertVisible = false;
  //     }, 4000);
  //   },
  //     error => {
  //       this.alertVisible = true;
  //       this.alertData = { message: 'Something went wrong!', type: 'error' };
  //       setTimeout(() => {
  //         this.alertVisible = false;
  //       }, 4000);
  //     });
  // }
  closeDocShow() {
    this.subDrawer.docShow = false;
  }

  close() {
    this.visible = false;
  }
  cancel() {
    this.alertVisible = false;
  }


  loadiFrame(eventInfo, employeeid, id) {
    this.defaultLanding = false;
    this.LoadForm = true;
    this.dmsService.getCancelLeaveUrl(id).subscribe((data: any) => {
      this.formUrl = this.sanitizer.bypassSecurityTrustResourceUrl(data.url);
    });
    this.iframeData = eventInfo;
    this.empId = employeeid;
  }

  closeForm(empId) {
    this.getCalendarData(empId);
    this.visible = false;
    this.defaultLanding = true;
    this.LoadForm = false;
    this.formUrl = '';
  }
}
