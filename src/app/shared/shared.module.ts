import { DatePipe, registerLocaleData, CommonModule } from '@angular/common';
import en from '@angular/common/locales/en';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, Title } from '@angular/platform-browser';
// File size converter
import { NgxFilesizeModule } from 'ngx-filesize';
// Bootstrap
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Charts
import { NgApexchartsModule } from 'ng-apexcharts';
// Daterangepicker
import { Daterangepicker } from 'ng2-daterangepicker';
// custom Select
import { NgSelectModule } from '@ng-select/ng-select';
// scroll
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG
} from 'ngx-perfect-scrollbar';
// short numbers
import { ShortNumberPipe } from 'src/pipes/short-number.pipe';
// Ant Design
// import { en_US, NgZorroAntdModule, NZ_I18N } from 'ng-zorro-antd';
import { IconsModule } from '../icons/icons.module'; // Feather Icons
import { IonicModule } from '@ionic/angular'; // Ioninc Icons

// Full Calender
import { FullCalendarModule } from '@fullcalendar/angular';

// videogular
import { VgCoreModule } from 'videogular2/compiled/core';
import { VgControlsModule } from 'videogular2/compiled/controls';
import { VgOverlayPlayModule } from 'videogular2/compiled/overlay-play';
import { VgBufferingModule } from 'videogular2/compiled/buffering';

registerLocaleData(en);
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  useBothWheelAxes: true
};

// Drag and Drop Sortable
import { SortablejsModule } from 'ngx-sortablejs';


@NgModule({
  declarations: [
    ShortNumberPipe,
  ],
  imports: [
    RouterModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IconsModule, // Feather Icons
    IonicModule.forRoot(), // Ionic Icons
    PerfectScrollbarModule,
    Daterangepicker,
    FullCalendarModule, // Fullcalender
    // Charts
    NgApexchartsModule,
    // Ant Module
    // NgZorroAntdModule,
    // Drag and Drop Sortable
    SortablejsModule,
    SortablejsModule.forRoot({
      animation: 200,
    }),
    // Bootstrap
    NgbModule,
    // Custom Select
    NgSelectModule,
    // Video Player
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    IconsModule, // Feather Icons
    IonicModule, // Ionic Icons
    // NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    Daterangepicker,
    FullCalendarModule, // Fullcalender
    NgApexchartsModule,
    ShortNumberPipe,
    NgxFilesizeModule,
    // Drag and Drop Sortable
    SortablejsModule,
    // Bootstrap
    NgbModule,
    // Custom Select
    NgSelectModule,
    // Video Player
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule
    ],
  providers: [
    Title,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    DatePipe,
    // Ant Module
    // { provide: NZ_I18N, useValue: en_US }
  ]
})
export class SharedModule { }
