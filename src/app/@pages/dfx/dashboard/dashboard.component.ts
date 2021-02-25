import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { forkJoin } from 'rxjs';
import { APIQueries } from 'src/app/services/apiQueries';
import { DashboardService } from 'src/app/services/dashboard.services';

declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.view.html',
})
export class DashboardComponent implements OnInit {
  @ViewChild('dateRangeValue') dateRangeValue: ElementRef;
  startDate: any = 'now-5m';
  endDate: any = 'now';
  config: any;
  sourceCount: any;
  migratedCount: any;
  DocumentTrainedCount: any;
  exceptionsCount: any;
  top5dataSourceTotalCount: any;
  top5dataModelTotalCount: any;
  top5dataSource: any;
  top5dataModel: any;
  top5Department: any = [];
  top5DepartmentTotalCount: any;
  discoveredCount: any;
  zeroKbFilesCount: any;
  passwordProtectedCount: any;
  corrupteCount: any;
  dateField: any = { created: [] };
  sourceObj: any;
  discoveredObj: any;
  migratedObj: any;
  trainedObj: any;
  zeroKbFilesObj: any;
  passwordProtectedObj: any;
  corruptedFilesObj: any;
  departmentObj: any;
  dataSourceObj: any;
  discoveredChartObj: any;
  migratedChartObj: any;
  trainedSetsObj: any;
  dataModelObj: any;
  clearFilter = false;
  // discoveredVsMigration: any;
  // trainedDocumentSets: any;

  // Discovered Vs Migration Chart Option
  discoveredVsMigration: any = {
    colors: ['var(--chart-one)', 'var(--chart-two)'],
    fill: {
      colors: ['var(--chart-one)', 'var(--chart-two)'],
      opacity: 0.38,
      type: 'solid',
    },
    responsive: [
      {
        options: {
          chart: {
            width: '100%',
          },
        },
      },
    ],
    chart: {
      height: 300,
      width: '100%',
      type: 'area',
      fontFamily: 'Helvetica, Arial, sans-serif',
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: false,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false,
          customIcons: [],
        },
        autoSelected: 'zoom',
      },
      animations: {
        enabled: false,
      },
    },
    legend: {
      show: true,
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '14px',
      fontFamily: 'Helvetica, Arial',
      fontWeight: 400,
      markers: {
        width: 13,
        height: 13,
        strokeWidth: 0,
        strokeColor: '#fff',
        radius: 3,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 0.5,
      colors: ['var(--chart-one)', 'var(--chart-two)'],
    },
    tooltip: {
      enabled: true,
      y: {
        show: true,
        format: 'dd/MM/yy HH:mm',
      },
    },
    series: [
      {
        name: 'Discovered',
        data: [0],
      },
      {
        name: 'Migrated',
        data: [0],
      },
    ],
    labels: ['Jan 1', 'Feb 2', 'Mar 3', 'Apr 4', 'May 5', 'Jun 6', 'Jul 7'],
    xaxis: {
      tickAmount: 'dataPoints',
      labels: {
        rotate: 0,
      },
    },
    yaxis: {
      tickAmount: 4,
      min: 1,
    },
  };
  // Trained document Sets Chart Option
  trainedDocumentSets: any = [];

  public daterange: any = {};
  public datePickerOptions: any = {
    autoApply: true,
    locale: { format: 'MMM D, YYYY' },
    ranges: {
      Today: [moment(), moment()],
      Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [
        moment().subtract(1, 'month').startOf('month'),
        moment().subtract(1, 'month').endOf('month'),
      ],
    },
    alwaysShowCalendars: false,
    opens: 'left',
  };
  autoRefresh: NodeJS.Timeout;
  ignoredFilesObj: any;
  ignoredCount: any;

  public generateData(baseval, count, yrange) {
    let i = 0;
    const series = [];
    while (i < count) {
      const x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
      const y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      const z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

      series.push([x, y, z]);
      baseval += 86400000;
      i++;
    }
    return series;
  }

  constructor(
    private dashboardService: DashboardService,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {
    this.getTotalCounts('');
    this.getTop5Data('');
    this.getChartsData('');
    this.loadDashboardData('');
  }

  reloadData() {
    this.getTotalCounts('');
    this.getTop5Data('');
    this.getChartsData('');
    this.clearFilter = false;
  }

  loadDashboardData(getDate: any) {
    // Reload data every one seconds
    if (getDate) {
      clearInterval(this.autoRefresh);
      this.getTotalCounts(getDate);
      this.getTop5Data(getDate);
      this.getChartsData(getDate);
    } else {
      this.autoRefresh = setInterval(() => {
        this.getTotalCounts('');
        this.getTop5Data('');
        this.getChartsData('');
      }, 300000);
    }
  }

  dateFilter(dateRangedates: any) {
    const startDate = this.datePipe.transform(
      dateRangedates.start._d,
      'yyyy-MM-dd'
    );
    const endDate = this.datePipe.transform(
      dateRangedates.end._d,
      'yyyy-MM-dd'
    );
    this.dateField = { created: { from: startDate, to: endDate } };
    this.loadDashboardData(this.dateField);
    this.clearFilter = true;
  }

  clearFilterData() {
    this.clearFilter = false;
    this.getTotalCounts('');
    this.getTop5Data('');
    this.getChartsData('');
  }

  getTotalCounts(getDate: any) {
    if (getDate) {
      // Soruce Count with date filter
      this.sourceObj = {
        ...APIQueries.sourceObj,
        query: {
          bool: {
            must: [
              {
                range: {
                  indexdate: {
                    gte: this.dateField.created.from,
                    lt: this.dateField.created.to,
                  },
                },
              },
            ],
          },
        },
      };
      // Discovered Count with date filter
      this.discoveredObj = {
        query: {
          bool: {
            must: [
              {
                range: {
                  indexdate: {
                    gte: this.dateField.created.from,
                    lt: this.dateField.created.to,
                  },
                },
              },
            ],
          },
        },
      };
      // Migration Count with date filter
      this.migratedObj = {
        query: {
          bool: {
            must: [
              {
                exists: {
                  field: 'dmsId',
                },
              },
            ],
            filter: [
              {
                range: {
                  indexdate: {
                    gte: this.dateField.created.from,
                    lt: this.dateField.created.to,
                  },
                },
              },
            ],
          },
        },
      };
      // Trained Documents Count with date filter
      this.trainedObj = {
        size: 0,
        query: {
          bool: {
            must: [
              {
                range: {
                  indexdate: {
                    gte: this.dateField.created.from,
                    lt: this.dateField.created.to,
                  }
                }
              }
            ]
          }
        },
        aggs: {
          by_model: {
            cardinality: {
              field: 'model.keyword'
            }
          }
        }
      };
      // ZeroKb files Count with date filter
      this.zeroKbFilesObj = {
        size: 0,
        query: {
          bool: {
            should: [{ match: { stream_size: 0 } }],
          },
        },
        aggs: {
          date_field: {
            date_range: {
              field: 'indexdate',
              format: 'yyyy-MM-dd',
              ranges: [
                {
                  from: this.dateField.created.from,
                  to: this.dateField.created.to,
                  key: 'date',
                },
              ],
              keyed: true,
            },
          },
        },
      };
      // Password Protected Count with date filter
      this.passwordProtectedObj = {
        size: 0,
        query: {
          bool: {
            must: {
              script: {
                script: {
                  inline: 'doc[\'content\'].empty',
                  lang: 'painless',
                },
              },
            },
            filter: [
              {
                range: {
                  indexdate: {
                    gte: this.dateField.created.from,
                    lt: this.dateField.created.to,
                  },
                },
              },
            ],
          },
        },
        aggs: {
          password: {
            filters: {
              filters: [
                { match: { pdfencrypted: 'true' } },
                { match: { security: '1' } },
                {
                  match: {
                    'contenttype.keyword': 'application/x-tika-ooxml-protected',
                  },
                },
              ],
            },
          },
          total_count_password: {
            sum_bucket: {
              buckets_path: 'password._count',
            },
          },
        },
      };
      this.corruptedFilesObj = {
        query: {
          bool: {
            filter: [
              {
                range: {
                  stream_size: {
                    gte: 1
                  }
                }
              }
            ],
            must_not: [
              {
                match: {
                  "pdf:encrypted": true
                }
              },
              {
                match: {
                  Security: 1
                }
              },
              {
                match: {
                  "Content-Type.keyword": "application/x-tika-ooxml-protected"
                }
              },
              {
                wildcard: {
                  content: "*"
                }
              }
            ]
          }
        },
      };

      this.ignoredFilesObj = {
        query: {
          bool: {
            filter: [
              {
                range: {
                  indexdate: {
                    gte: this.dateField.created.from,
                    lt: this.dateField.created.from,
                  },
                },
              },
            ],
            must: [
              {
                match: {
                  resolve_type: '-1',
                },
              },
            ],
          },
        },
      };
    } else {
      this.sourceObj = APIQueries.sourceObj;
      this.discoveredObj = APIQueries.discoveredObj;
      this.migratedObj = APIQueries.migratedObj;
      this.trainedObj = APIQueries.trainedObj;
      this.zeroKbFilesObj = APIQueries.zeroKbFilesObj;
      this.passwordProtectedObj = APIQueries.passwordProtectedObj;
      this.corruptedFilesObj = APIQueries.corruptedFilesObj;
      this.ignoredFilesObj = APIQueries.ignoredFilesObj;
    }
    // Total Source count
    this.dashboardService
      .trackTotalUitsUrl(this.sourceObj)
      .subscribe((data) => {
        this.sourceCount = data.aggregations.repo_count.value;
      });
    // Total discovered count
    this.dashboardService.countUrl(this.discoveredObj).subscribe((data) => {
      this.discoveredCount = data.count;
    });
    // Total Migrated count
    this.dashboardService.countUrl(this.migratedObj).subscribe((data) => {
      this.migratedCount = data.count;
    });
    // Total Document Trained count
    this.dashboardService
      .trackTotalUitsUrl(this.trainedObj)
      .subscribe((data) => {
        // const DataArray = data.aggregations.group_by_parent.buckets.map(
        //   (datas) => datas.modelcount.value
        // );
        console.log(data);
        this.DocumentTrainedCount = data.aggregations.by_model.value;
        // DataArray.reduce(
        //   (acc, cur) => acc + cur,
        //   0
        // );
      });
    // Exception Data Count
    const obj = {};
    if (getDate) {
      forkJoin([
        this.dashboardService.trackTotalUitsUrl(this.zeroKbFilesObj),
        this.dashboardService.searchUrl(this.passwordProtectedObj),
        this.dashboardService.countUrl(this.corruptedFilesObj),
        this.dashboardService.countUrl(this.ignoredFilesObj),
      ]).subscribe(([zerokb, password, corrupt, ignored]: any) => {
        // console.log(password)
        this.zeroKbFilesCount =
          zerokb.aggregations.date_field.buckets.date.doc_count;
        this.passwordProtectedCount =
          password.aggregations.total_count_password.value;
        this.corrupteCount = corrupt.count;
        this.ignoredCount = ignored.count;
        this.exceptionsCount =
          this.zeroKbFilesCount +
          this.passwordProtectedCount +
          this.corrupteCount +
          this.ignoredCount;
      });
    } else {
      forkJoin([
        this.dashboardService.countUrl(this.zeroKbFilesObj),
        this.dashboardService.searchUrl(this.passwordProtectedObj),
        this.dashboardService.countUrl(this.corruptedFilesObj),
        this.dashboardService.countUrl(this.ignoredFilesObj),
      ]).subscribe(([zerokb, password, corrupt, ignored]: any) => {
        this.zeroKbFilesCount = zerokb.count;
        this.passwordProtectedCount =
          password.aggregations.total_count_password.value;
        this.corrupteCount = corrupt.count;
        this.ignoredCount = ignored.count;
        this.exceptionsCount =
          this.zeroKbFilesCount +
          this.passwordProtectedCount +
          this.corrupteCount +
          this.ignoredCount;
      });
    }
  }

  getTop5Data(getDate: any) {
    if (getDate) {
      // Top 5 department with date filter
      this.departmentObj = {
        size: 0,
        query: {
          bool: {
            must: [
              {
                range: {
                  indexdate: {
                    gte: this.dateField.created.from,
                    lt: this.dateField.created.to,
                  },
                },
              },
            ],
          },
        },
        aggs: {
          by_source: {
            terms: {
              field: 'department.keyword',
              size: 5,
            },
          },
        },
      };
      // Top 5 data Sources with date filter
      this.dataSourceObj = {
        size: 0,
        query: {
          bool: {
            must: [
              {
                range: {
                  indexdate: {
                    gte: this.dateField.created.from,
                    lt: this.dateField.created.to,
                  },
                },
              },
            ],
          },
        },
        aggs: {
          by_source: {
            terms: {
              field: 'location.keyword',
              size: 5,
            },
          },
        },
      };
      // Top 5 data Models with date filter
      this.dataModelObj = {
        size: 0,
        query: {
          bool: {
            must: [
              {
                range: {
                  indexdate: {
                    gte: this.dateField.created.from,
                    lt: this.dateField.created.to,
                  }
                }
              }
            ]
          }
        },
        aggs: {
          by_model: {
            terms: {
              field: 'model.keyword',
              size: 5
            }
          }
        }
      };
    } else {
      this.departmentObj = APIQueries.departmentObj;
      this.dataSourceObj = APIQueries.dataSourceObj;
      this.dataModelObj = APIQueries.dataModelObj;
    }
    // Top 5 Department Volume
    this.dashboardService
      .trackTotalUitsUrl(this.departmentObj)
      .subscribe((data) => {
        this.top5DepartmentTotalCount = data.hits.total.value;
        this.top5Department = data.aggregations.by_source.buckets;
      });
    // Top 5 Data Sources
    this.dashboardService
      .trackTotalUitsUrl(this.dataSourceObj)
      .subscribe((data) => {
        this.top5dataSourceTotalCount = data.hits.total.value;
        this.top5dataSource = data.aggregations.by_source.buckets;
      });
    // Top 5 Data Sources
    this.dashboardService
      .trackTotalUitsUrl(this.dataModelObj)
      .subscribe((data) => {
        this.top5dataModelTotalCount = data.hits.total.value;
        this.top5dataModel = data.aggregations.by_model.buckets;
      });
  }

  getChartsData(getDate: any) {
    if (getDate) {
      // Discovered Data for chart with date filter
      this.discoveredChartObj = {
        size: 0,
        query: {
          bool: {
            must: [
              {
                range: {
                  indexdate: {
                    gte: this.dateField.created.from,
                    lt: this.dateField.created.to,
                  },
                },
              },
            ],
          },
        },
        aggs: {
          groups_by_day: {
            date_histogram: {
              field: 'indexdate',
              format: 'dd-MM-yyyy',
              interval: 'day',
              min_doc_count: 1,
            },
          },
        },
      };
      // Migrates Data for chart with date filter
      this.migratedChartObj = {
        size: 0,
        query: {
          bool: {
            should: [{ match: { migration: 1 } }],
            filter: [
              {
                range: {
                  indexdate: {
                    gte: this.dateField.created.from,
                    lt: this.dateField.created.to,
                  },
                },
              },
            ],
          },
        },
        aggs: {
          groups_by_day: {
            date_histogram: {
              field: 'indexdate',
              format: 'dd-MM-yyyy',
              interval: 'day',
              min_doc_count: 1,
            },
          },
        },
      };
      // Trained Sets Data for chart with date filter
      this.trainedSetsObj = {
        size: 0,
        query: {
          bool: {
            must: [
              {
                range: {
                  indexdate: {
                    gte: this.dateField.created.from,
                    lt: this.dateField.created.to,
                  },
                },
              },
            ],
            filter: {
              wildcard: {
                content: '*',
              },
            },
          },
        },
        aggs: {
          unclassified: {
            missing: { field: 'model' },
          },
          classified: {
            filter: { exists: { field: 'model' } },
          },
        },
      };
    } else {
      this.discoveredChartObj = APIQueries.discoveredChartObj;
      this.migratedChartObj = APIQueries.migratedChartObj;
      this.trainedSetsObj = APIQueries.trainedSetsObj;
    }
    forkJoin([
      this.dashboardService.searchUrl(this.discoveredChartObj),
      this.dashboardService.searchUrl(this.migratedChartObj),
    ]).subscribe(([discovered, migrated]: any) => {
      this.discoveredVsMigration = {
        ...this.discoveredVsMigration,
        series: [
          {
            name: 'Discovered',
            data: discovered.aggregations.groups_by_day.buckets.map(
              (data) => data.doc_count
            ),
          },
          {
            name: 'Migrated',
            data: migrated.aggregations.groups_by_day.buckets.map(
              (data) => data.doc_count
            ),
          },
        ],
        labels: discovered.aggregations.groups_by_day.buckets.map(
          (data) => data.key_as_string
        ),
        // moment.utc(data.key_as_string).format('D/MM, HH:mm')
      };
    });
    // Total Migrated count
    this.dashboardService
      .trackTotalUitsUrl(this.trainedSetsObj)
      .subscribe((data) => {
        this.trainedDocumentSets = {
          unclassified: data.aggregations.unclassified.doc_count,
          classified: data.aggregations.classified.doc_count,
        };
      });
  }

  ngOnDestroy() {
    if (this.autoRefresh) {
      clearInterval(this.autoRefresh);
    }
  }
}
