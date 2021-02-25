import { DatePipe } from "@angular/common";
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { isString } from "lodash";
import * as moment from "moment";
import { NgxSpinnerService } from "ngx-spinner";
import { either, isEmpty, isNil } from "ramda";
import { Observable, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged, map } from "rxjs/operators";
import { ClassificationService } from "src/app/services/classification.services";
import { SearchService } from "src/app/services/search.services";
declare var jQuery: any;
declare var $: any;
const isEmptyNil = either(isEmpty, isNil);

@Component({
  selector: "app-searchengine",
  templateUrl: "./searchengine.view.html",
})
export class SearchengineComponent implements OnInit, OnDestroy {
  source: Subscription;
  @ViewChild("secSearchkey") secSearchkey: ElementRef;
  @ViewChild("exten") exten: ElementRef;
  @ViewChild("auth") auth: ElementRef;
  @ViewChild("loca") loca: ElementRef;
  @ViewChild("depar") depa: ElementRef;
  @ViewChild("migr") migr: ElementRef;
  @ViewChild("clie") clie: ElementRef;
  @ViewChild("type") type: ElementRef;
  @ViewChild("dateRangeValue") dateRangeValue: ElementRef;

  dataLoader = false;
  longWait = false;
  apiRespondError = false;
  configShow = true;
  searchResult: any = [];
  config: any;
  aggregateExtension: any = [];
  aggregateAuthor: any = [];
  aggregateLocation: any = [];
  aggregateClientPartion: any = [];
  aggregateDepartment: any = [];
  aggregateMigrated: any = [];
  aggregateClient: any = [];
  aggregateType: any = [];
  fullResult: any;
  extArray: any = [];
  mocSearchResult: any;
  displaySearchResult: any;
  pageCount = 1;
  body: any;
  files0Kb: any;
  passwordPro: any;
  suggessionList: any = [];
  SearchResultCount: any;
  resultDesc: any;
  loadRole = false;
  selectedIndex: number = null;
  searchAggregationExt: any = [];
  searchAggregationAuth: any = [];
  searchAggregationCpco: any = [];
  searchAggregationLoca: any = [];
  searchAggregationDepa: any = [];
  searchAggregationMigr: any = [];
  searchAggregationClie: any = [];
  searchAggregationType: any = [];
  displayData: boolean;
  autArray: any = [];
  locArray: any = [];
  cpcArray: any = [];
  depArray: any = [];
  migArrayS: any = [];
  migArrayF: any = [];
  cliArray: any = [];
  typArray: any = [];
  sortObj: any[] = [];
  dateField: any = { created: [] };
  sortName = "Recent";
  sortNameList = "desc";
  keySearchValue: any;
  contentClass = "search_cont";
  formClass = "";
  bgClass = "";
  clearDate = false;
  apiAccessError = false;
  searchHeaderClass = "";
  public clientModel: any;
  public typeModel: any;
  public daterange: any = {};
  public options: any = {
    autoApply: true,
    locale: { format: "MMM D, YYYY" },
    ranges: {
      Today: [moment(), moment()],
      Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
      "Last 7 Days": [moment().subtract(6, "days"), moment()],
      "Last 30 Days": [moment().subtract(29, "days"), moment()],
      "This Month": [moment().startOf("month"), moment().endOf("month")],
      "Last Month": [
        moment().subtract(1, "month").startOf("month"),
        moment().subtract(1, "month").endOf("month"),
      ],
    },
    alwaysShowCalendars: false,
  };
  searchShow: boolean;
  frequencyOption = [
    {
      id: "15mins",
      text: "15 Minutes",
    },
    {
      id: "30mins",
      text: "30 Minutes",
    },
    {
      id: "45mins",
      text: "45 Minutes",
    },
    {
      id: "60mins",
      text: "60 Minutes",
    },
  ];
  filescount0KB: any;
  filescountencrypt: any;
  exception = false;
  exceptionZero = false;
  exceptionPass = false;
  migrationSF = false;
  migrationSuccess = false;
  migrationFailed = false;
  file = { filePath: "" };
  showModalBox = false;
  autoRefresh: any;
  extenSelected: any = {};
  filescountmigrated: any;
  filescountnonmigrated: any;
  filescountcorrupted: any;
  exceptionCorrupted = false;
  exceptionMigrated: boolean;
  exceptionNonMigrated: boolean;
  eventmigration: any;
  eventnonmigration: any;
  corrupted: any = {};
  eventcorrupted: any;
  exceptionIgnored: any;
  eventignored: any;
  ignored: { query: { bool: { must: { match: { resolve_type: string } }[] } } };
  filescountignored: any;

  constructor(
    private searchService: SearchService,
    public classService: ClassificationService,
    private datePipe: DatePipe,
    private SpinnerService: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.classService.shown = false;

    if (this.autoRefresh) {
      clearInterval(this.autoRefresh);
    }
  }

  removeEmptyKeyFromObject(obj) {
    return Object.keys(obj).forEach((data) => {
      obj[data] = isString(obj[data]) ? obj[data].trim() : obj[data];
      if (isEmptyNil(obj[data])) {
        delete obj[data];
      }
    });
  }

  setMatchObject(keyword) {
    return keyword === "searchAll"
      ? { match_all: {} }
      : {
          multi_match: {
            query: keyword || "",
            fields: [
              "clientpartioncode",
              "pd_subtype",
              "content",
              "resourcename",
              "clientname",
              "mg_clientcode",
              "pd_type",
              "dmsid",
              "clientid",
              "uri",
            ],
            type: "bool_prefix",
          },
        };
  }

  setBody(keyword, getDate) {
    this.body = {
      query: {
        bool: {
          must: [this.setMatchObject(keyword)],
          filter: [],
        },
      },
      aggs: {
        by_extension: { terms: { field: "mimetype.keyword" } },
        by_date: { terms: { field: "lastmodifieddate" } },
        by_author: { terms: { field: "author.keyword" } },
        by_migration: { terms: { field: "migration" } },
        by_mgclientname: { terms: { field: "clientname.keyword" } },
        by_clientpartitioncode: {
          terms: { field: "partitioncode" },
        },
        // by_pdsubtype: { terms: { field: 'pd_subtype.keyword' } },
        by_pdtype: { terms: { field: "pd_type.keyword" } },
        by_jobcategory: { terms: { field: "location.keyword" } },
        by_jobsubcategory: { terms: { field: "department.keyword" } },
        groups: {
          date_histogram: {
            field: "createddate",
            interval: "month",
            min_doc_count: 1,
          },
        },
      },
      highlight: {
        fields: {
          "*": { type: "plain" },
        },
      },
      from: (this.pageCount - 1) * 10,
      size: 10,
    };
    if (getDate) {
      this.body = {
        ...this.body,
        query: {
          bool: {
            must: [this.setMatchObject(keyword)],
            filter: [
              {
                range: {
                  indexdate: {
                    from: this.dateField.created.from,
                    to: this.dateField.created.to,
                  },
                },
              },
            ],
          },
        },
      };
    } else {
      this.body = this.body;
    }

    // const extterm = {
    //   terms: {
    //     'mime-type':
    //       this.extArray.map((data) => (data === 'jpg' ? 'jpeg' : data)) || [],
    //   },
    // };

    const extterm = {
      multi_match: {
        query: this.extArray
          .map((data) => (data === "jpg" ? "jpeg" : data))
          .join(" "),
        fields: ["mimetype"],
      },
    };

    const authterm = { terms: { "author.keyword": this.autArray || [] } };
    const cpcoterm = {
      terms: { partitioncode: this.cpcArray || [] },
    };
    const locaterm = { terms: { "location.keyword": this.locArray || [] } };
    const departerm = {
      terms: { "department.keyword": this.depArray || [] },
    };
    const migrterm = {
      terms: {
        migration:
          this.migArrayS && this.migArrayF
            ? [...this.migArrayF, ...this.migArrayS]
            : this.migArrayS || this.migArrayF || [],
      },
    };
    const clieterm = {
      terms: { "clientname.keyword": this.cliArray || [] },
    };
    const typeterm = { terms: { "pd_type.keyword": this.typArray || [] } };

    this.removeEmptyKeyFromObject(extterm);
    this.removeEmptyKeyFromObject(authterm);
    this.removeEmptyKeyFromObject(cpcoterm);
    this.removeEmptyKeyFromObject(locaterm);
    this.removeEmptyKeyFromObject(departerm);
    this.removeEmptyKeyFromObject(migrterm);
    this.removeEmptyKeyFromObject(clieterm);
    this.removeEmptyKeyFromObject(typeterm);
    const Obj = [
      authterm,
      cpcoterm,
      locaterm,
      departerm,
      migrterm,
      clieterm,
      typeterm,
    ];

    const filterObject = [
      Object.keys(authterm.terms),
      Object.keys(cpcoterm.terms),
      Object.keys(locaterm.terms),
      Object.keys(departerm.terms),
      Object.keys(migrterm.terms),
      Object.keys(clieterm.terms),
      Object.keys(typeterm.terms),
    ];

    const ObjMultiMatch = [extterm];
    const filterMultiMatch = [Object.keys(extterm.multi_match)];
    for (let i = 0; i < filterMultiMatch.length; i++) {
      if (ObjMultiMatch[i].multi_match[filterMultiMatch[i][0]].length) {
        this.body = {
          ...this.body,
          query: {
            bool: {
              must: [this.setMatchObject(keyword)],
              filter: [...this.body.query.bool.filter, ObjMultiMatch[i]],
            },
          },
        };
      }
    }
    for (let i = 0; i < filterObject.length; i++) {
      if (Obj[i].terms[filterObject[i][0]].length) {
        this.body = {
          ...this.body,
          query: {
            bool: {
              must: [this.setMatchObject(keyword)],
              filter: [...this.body.query.bool.filter, Obj[i]],
            },
          },
        };
      }
    }

    this.removeEmptyKeyFromObject(this.body.query.bool);
    this.body = {
      ...this.body,
      sort: this.sortObj,
    };
    this.removeEmptyKeyFromObject(this.body.aggs);
    this.removeEmptyKeyFromObject(this.body);
    return this.body;
  }

  getAggregation(response) {
    // Get Authors
    this.aggregateAuthor = response.aggregations.by_author.buckets
      .map((authors) => authors)
      .map((data) => ({
        label: data.key,
        count: data.doc_count,
        selected: false,
      }));
    // Get Client partion Code
    this.aggregateClientPartion = response.aggregations.by_clientpartitioncode.buckets
      .map((clientpartioncode) => clientpartioncode)
      .map((data) => ({
        label: data.key,
        count: data.doc_count,
        selected: false,
      }));
    // Get mime Type
    this.aggregateExtension = response.aggregations.by_extension.buckets
      .map((extentions) => extentions)
      .map((data) => ({
        label: data.key === "jpeg" ? "jpg" : data.key,
        count: data.doc_count,
        selected: false,
      }));
    // Get Location
    this.aggregateLocation = response.aggregations.by_jobcategory.buckets
      .map((locations) => locations)
      .map((data) => ({
        label: data.key,
        count: data.doc_count,
        selected: false,
      }));
    // Get Department
    this.aggregateDepartment = response.aggregations.by_jobsubcategory.buckets
      .map((departments) => departments)
      .map((data) => ({
        label: data.key,
        count: data.doc_count,
        selected: false,
      }));
    // Get Client
    this.aggregateClient = response.aggregations.by_mgclientname.buckets
      .map((clients) => clients)
      .map((data) => data.key);
    // Get Type
    this.aggregateType = response.aggregations.by_pdtype.buckets
      .map((types) => types)
      .map((data) => data.key);
    // Get Migrated
    this.aggregateMigrated = {
      migrated: response.aggregations.by_migration.buckets
        .map((data) => ({
          label: data.key,
          count: data.doc_count,
          selected: false,
        }))
        .filter((data) => data.label === 1),
      migratedCount: response.aggregations.by_migration.buckets
        .filter((data) => data.key === 1)
        .map((data) => data.doc_count)
        .reduce((a, b) => {
          return a + b;
        }, 0),
      notmigrated: response.aggregations.by_migration.buckets
        .map((data) => ({
          label: data.key,
          count: data.doc_count,
          selected: false,
        }))
        .filter((data) => data.label !== 1),
      notmigratedCount: response.aggregations.by_migration.buckets
        .filter((data) => data.key !== 1)
        .map((data) => data.doc_count)
        .reduce((a, b) => {
          return a + b;
        }, 0),
      migratedvalue: response.aggregations.by_migration.buckets
        .map((data) => data.key)
        .filter((data) => data === 1),
      notmigratedvalue: response.aggregations.by_migration.buckets
        .map((migrateds) => migrateds)
        .map((data) => data.key)
        .filter((data) => data !== 1),
    };
  }

  getDocuments(response) {
    this.searchResult = response.hits.hits.map((data) => data);
    this.searchAggregationExt = response.aggregations.by_extension.buckets.map(
      (data) => data
    );
    this.searchAggregationAuth = response.aggregations.by_author.buckets.map(
      (data) => data
    );
    this.searchAggregationCpco = response.aggregations.by_clientpartitioncode.buckets.map(
      (data) => data
    );
    this.searchAggregationLoca = response.aggregations.by_jobcategory.buckets.map(
      (data) => data
    );
    this.searchAggregationDepa = response.aggregations.by_jobsubcategory.buckets.map(
      (data) => data
    );
    this.searchAggregationMigr = response.aggregations.by_migration.buckets.map(
      (data) => data
    );
    this.searchAggregationClie = response.aggregations.by_mgclientname.buckets.map(
      (data) => data
    );
    this.searchAggregationType = response.aggregations.by_pdtype.buckets.map(
      (data) => data
    );
    this.displaySearchResult = response.hits.hits.map((data) => ({
      fileName: data._source.resourcename,
      filePath: data._source.uri,
      lfUrl: data._source.lf_uri
        ? data._source.lf_uri instanceof Array
          ? data._source.lf_uri
          : [data._source.lf_uri]
        : data._source.lf_uri,
      lastModified: data._source.indexdate,
      dmsLinkID: data._source.dmsId,
      score: data._score,
      highlight: data.highlight,
      Author: data._source.author,
      mimeType: data._source.mimetype,
      streamSize: data._source.stream_size,
      created: data._source.createddate,
      indexed: data._source.indexdate,
      parent: data._source.parent,
      model: data._source.model,
      child: data._source.child,
      location: data._source.location,
      department: data._source.department,
    }));
    this.SearchResultCount = response.hits.total;
    this.mocSearchResult = response.hits.hits.map((data) => data);
    this.displayData = this.searchResult.length ? true : false;
  }

  triggerSearch(value?: any) {
    this.resultDesc = false;
    this.selectedIndex = null;
    $(".result_brief").removeClass("active");
    this.configShow = false;
    this.dataLoader = true;
    if (this.dataLoader) {
      setTimeout(() => {
        this.longWait = true;
      }, 20000);
    }
    this.loadRole = true;
    if (
      this.secSearchkey.nativeElement.value.length > 0 ||
      this.searchResult.length > 0
    ) {
      this.contentClass = "search_pad";
      this.formClass = "justify-content-between";
      this.bgClass = "bgs";
      this.searchHeaderClass = "nope";
      this.searchShow = true;
    } else {
      this.longWait = false;
      this.dataLoader = false;
      this.contentClass = "search_cont";
      this.formClass = "";
      this.bgClass = "";
      this.searchHeaderClass = "";
      this.searchShow = false;
    }
    // this.getAutosuggetion(value);
    this.searchService
      .getSearchResult(JSON.stringify(this.setBody(value, "")))
      .subscribe(
        (response: any) => {
          this.getAggregation(response);
          this.configShow = false;
          this.longWait = false;
          this.dataLoader = false;
          this.loadRole = false;
          this.fullResult = response;
          this.getDocuments(response);
          this.keySearchValue = value;
        },
        (error) => {
          this.apiRespondError = true;
          this.apiRespondError = true;
          if (error.status === 403) {
            this.apiAccessError = true;
          }
        }
      );

    // Password protected and 0KB files
    this.searchService
      .getSearchResult(JSON.stringify(this.setBody0kbFiles()))
      .subscribe((response: any) => {
        this.filescount0KB = response.hits.total.value;
      });
    this.searchService
      .getSearchResult(JSON.stringify(this.setBodyPasswordFiles()))
      .subscribe((response: any) => {
        this.filescountencrypt = response.hits.total.value;
      });
    this.searchService
      .getSearchResult(JSON.stringify(this.setBodymigratedFiles()))
      .subscribe((response: any) => {
        this.filescountmigrated = response.hits.total.value;
      });
    this.searchService
      .getSearchResult(JSON.stringify(this.setBodynonmigratedFiles()))
      .subscribe((response: any) => {
        this.filescountnonmigrated = response.hits.total.value;
      });
    this.searchService
      .getSearchResult(JSON.stringify(this.setBodyCorreptedFiles()))
      .subscribe((response: any) => {
        this.filescountcorrupted = response.hits.total.value;
      });

    this.searchService
      .getSearchResult(JSON.stringify(this.setBodyIgnoredFiles()))
      .subscribe((response: any) => {
        this.filescountignored = response.hits.total.value;
      });
  }

  setBodymigratedFiles() {
    return {
      from: (this.pageCount - 1) * 10,
      size: 10,
      query: {
        bool: {
          must: [
            {
              exists: {
                field: "dmsId.keyword",
              },
            },
          ],
        },
      },
    };
  }

  setBodynonmigratedFiles() {
    return {
      from: (this.pageCount - 1) * 10,
      size: 10,
      query: {
        bool: {
          must_not: [
            {
              exists: {
                field: "dmsId.keyword",
              },
            },
          ],
        },
      },
    };
  }

  getDataMigratedFiles(event?: any) {
    this.eventmigration = event;
    this.exception = true;
    this.exceptionZero = false;
    this.exceptionPass = false;
    this.migrationSuccess = event.target.checked;
    this.migrationFailed = false;
    this.extArray = [];
    this.autArray = [];
    this.cpcArray = [];
    this.locArray = [];
    this.depArray = [];
    this.migArrayS = [];
    this.migArrayF = [];
    this.cliArray = [];
    this.typArray = [];
    if (event.target.checked) {
      this.searchService
        .getSearchResult(this.setBodymigratedFiles())
        .subscribe((response: any) => {
          this.displaySearchResult = response.hits.hits.map((data) => ({
            fileName: data._source.resourcename,
            filePath: data._source.uri,
            lfUrl: data._source.lf_uri
              ? data._source.lf_uri instanceof Array
                ? data._source.lf_uri
                : [data._source.lf_uri]
              : data._source.lf_uri,
            lastModified: data._source.indexdate,
            dmsLinkID: data._source.dmsId,
            score: data._score,
            highlight: data.highlight,
            Author: data._source.author,
            mimeType: data._source.mimetype,
            streamSize: data._source.stream_size,
            created: data._source.createddate,
            indexed: data._source.indexdate,
            parent: data._source.parent,
            model: data._source.model,
            child: data._source.child,
            location: data._source.location,
            department: data._source.department,
          }));
          this.SearchResultCount = response.hits.total;
          this.displayData = this.SearchResultCount ? true : false;
        });
    } else {
      this.getData(this.keySearchValue, "");
    }
  }

  getDataNonMigratedFiles(event?: any) {
    this.eventnonmigration = event;
    this.exception = true;
    this.exceptionZero = false;
    this.exceptionPass = false;
    this.migrationSuccess = false;
    this.migrationFailed = event.target.checked;
    this.extArray = [];
    this.autArray = [];
    this.cpcArray = [];
    this.locArray = [];
    this.depArray = [];
    this.migArrayS = [];
    this.migArrayF = [];
    this.cliArray = [];
    this.typArray = [];
    if (event.target.checked) {
      this.searchService
        .getSearchResult(this.setBodynonmigratedFiles())
        .subscribe((response: any) => {
          this.displaySearchResult = response.hits.hits.map((data) => ({
            fileName: data._source.resourcename,
            filePath: data._source.uri,
            lfUrl: data._source.lf_uri
              ? data._source.lf_uri instanceof Array
                ? data._source.lf_uri
                : [data._source.lf_uri]
              : data._source.lf_uri,
            lastModified: data._source.indexdate,
            dmsLinkID: data._source.dmsId,
            score: data._score,
            highlight: data.highlight,
            Author: data._source.author,
            mimeType: data._source.mimetype,
            streamSize: data._source.stream_size,
            created: data._source.createddate,
            indexed: data._source.indexdate,
            parent: data._source.parent,
            model: data._source.model,
            child: data._source.child,
            location: data._source.location,
            department: data._source.department,
          }));
          this.SearchResultCount = response.hits.total;
          this.displayData = this.SearchResultCount ? true : false;
        });
    } else {
      this.getData(this.keySearchValue, "");
    }
  }

  getData(searchKey: any, getDate: any) {
    this.resultDesc = false;
    this.selectedIndex = null;
    // this.updateAggregation(this.setBody(searchKey, getDate));
    this.searchService
      .getSearchResult(JSON.stringify(this.setBody(searchKey, getDate)))
      .subscribe((response: any) => {
        this.fullResult = response;
        // this.getAggregation(response);
        this.getDocuments(response);
      });
    // Password protected and 0KB files
    this.searchService
      .getSearchResult(JSON.stringify(this.setBody0kbFiles()))
      .subscribe((response: any) => {
        this.filescount0KB = response.hits.total.value;
      });
    this.searchService
      .getSearchResult(JSON.stringify(this.setBodyPasswordFiles()))
      .subscribe((response: any) => {
        this.filescountencrypt = response.hits.total.value;
      });
    this.searchService
      .getSearchResult(JSON.stringify(this.setBodymigratedFiles()))
      .subscribe((response: any) => {
        this.filescountmigrated = response.hits.total.value;
      });
    this.searchService
      .getSearchResult(JSON.stringify(this.setBodynonmigratedFiles()))
      .subscribe((response: any) => {
        this.filescountnonmigrated = response.hits.total.value;
      });
    this.searchService
      .getSearchResult(JSON.stringify(this.setBodyCorreptedFiles()))
      .subscribe((response: any) => {
        this.filescountcorrupted = response.hits.total.value;
      });
    this.searchService
      .getSearchResult(JSON.stringify(this.setBodyIgnoredFiles()))
      .subscribe((response: any) => {
        this.filescountignored = response.hits.total.value;
      });
  }

  setBody0kbFiles() {
    this.files0Kb = {
      from: 0,
      size: 20,
      query: {
        bool: {
          should: [
            {
              match: {
                stream_size: 0,
              },
            },
          ],
        },
      },
    };
    return this.files0Kb;
  }

  setBodyPasswordFiles() {
    this.passwordPro = {
      from: 0,
      size: 20,
      query: {
        bool: {
          should: [
            { match: { pdfencrypted: "true" } },
            { match: { security: "1" } },
            {
              match: {
                "contenttype.keyword": "application/x-tika-ooxml-protected",
              },
            },
          ],
          must_not: [
            {
              wildcard: {
                content: "*",
              },
            },
          ],
        },
      },
    };
    return this.passwordPro;
  }

  setBodyCorreptedFiles() {
    this.corrupted = {
      from: (this.pageCount - 1) * 10,
      size: 10,
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
    return this.corrupted;
  }

  setBodyIgnoredFiles() {
    this.ignored = {
      query: {
        bool: {
          must: [
            {
              match: {
                resolve_type: "-1",
              },
            },
          ],
        },
      },
    };
    return this.ignored;
  }

  getDataCorrupted(event?: any) {
    this.eventcorrupted = event;
    this.exception = true;
    this.exceptionZero = false;
    this.exceptionPass = false;
    this.migrationSuccess = false;
    this.migrationFailed = false;
    this.exceptionCorrupted = event.target.checked;
    this.extArray = [];
    this.autArray = [];
    this.cpcArray = [];
    this.locArray = [];
    this.depArray = [];
    this.migArrayS = [];
    this.migArrayF = [];
    this.cliArray = [];
    this.typArray = [];
    if (event.target.checked) {
      this.searchService
        .getSearchResult(this.setBodyCorreptedFiles())
        .subscribe((response: any) => {
          this.displaySearchResult = response.hits.hits.map((data) => ({
            fileName: data._source.resourcename,
            filePath: data._source.uri,
            lfUrl: data._source.lf_uri
              ? data._source.lf_uri instanceof Array
                ? data._source.lf_uri
                : [data._source.lf_uri]
              : data._source.lf_uri,
            lastModified: data._source.indexdate,
            dmsLinkID: data._source.dmsId,
            score: data._score,
            highlight: data.highlight,
            Author: data._source.author,
            mimeType: data._source.mimetype,
            streamSize: data._source.stream_size,
            created: data._source.createddate,
            indexed: data._source.indexdate,
            parent: data._source.parent,
            model: data._source.model,
            child: data._source.child,
            location: data._source.location,
            department: data._source.department,
          }));
          this.SearchResultCount = response.hits.total;
          this.displayData = this.SearchResultCount ? true : false;
        });
    } else {
      this.getData(this.keySearchValue, "");
    }
  }

  getDataIgnoredFiles(event?: any) {
    this.eventignored = event;
    this.exception = true;
    this.exceptionZero = false;
    this.exceptionPass = false;
    this.migrationSuccess = false;
    this.migrationFailed = false;
    this.exceptionCorrupted = false;
    this.exceptionIgnored = event.target.checked;
    this.extArray = [];
    this.autArray = [];
    this.cpcArray = [];
    this.locArray = [];
    this.depArray = [];
    this.migArrayS = [];
    this.migArrayF = [];
    this.cliArray = [];
    this.typArray = [];
    if (event.target.checked) {
      this.searchService
        .getSearchResult(this.setBodyIgnoredFiles())
        .subscribe((response: any) => {
          this.displaySearchResult = response.hits.hits.map((data) => ({
            fileName: data._source.resourcename,
            filePath: data._source.uri,
            lfUrl: data._source.lf_uri
              ? data._source.lf_uri instanceof Array
                ? data._source.lf_uri
                : [data._source.lf_uri]
              : data._source.lf_uri,
            lastModified: data._source.indexdate,
            dmsLinkID: data._source.dmsId,
            score: data._score,
            highlight: data.highlight,
            Author: data._source.author,
            mimeType: data._source.mimetype,
            streamSize: data._source.stream_size,
            created: data._source.createddate,
            indexed: data._source.indexdate,
            parent: data._source.parent,
            model: data._source.model,
            child: data._source.child,
            location: data._source.location,
            department: data._source.department,
          }));
          this.SearchResultCount = response.hits.total;
          this.displayData = this.SearchResultCount ? true : false;
        });
    } else {
      this.getData(this.keySearchValue, "");
    }
  }

  getDataZeroKB(event: any) {
    this.exception = true;
    this.exceptionZero = true;
    this.exceptionPass = false;
    this.extArray = [];
    this.autArray = [];
    this.cpcArray = [];
    this.locArray = [];
    this.depArray = [];
    this.migArrayS = [];
    this.migArrayF = [];
    this.cliArray = [];
    this.typArray = [];
    if (event.target.checked) {
      this.searchService
        .getSearchResult(this.files0Kb)
        .subscribe((response: any) => {
          this.displaySearchResult = response.hits.hits.map((data) => ({
            fileName: data._source.resourcename,
            filePath: data._source.uri,
            lfUrl: data._source.lf_uri
              ? data._source.lf_uri instanceof Array
                ? data._source.lf_uri
                : [data._source.lf_uri]
              : data._source.lf_uri,
            lastModified: data._source.indexdate,
            dmsLinkID: data._source.dmsId,
            score: data._score,
            highlight: data.highlight,
            Author: data._source.author,
            mimeType: data._source.mimetype,
            streamSize: data._source.stream_size,
            created: data._source.createddate,
            indexed: data._source.indexdate,
            parent: data._source.parent,
            model: data._source.model,
            child: data._source.child,
            location: data._source.location,
            department: data._source.department,
          }));
          this.SearchResultCount = response.hits.total;
          this.displayData = this.SearchResultCount ? true : false;
        });
    } else {
      this.getData(this.keySearchValue, "");
    }
  }

  getDataPasswordFiles(event: any) {
    this.exception = true;
    this.exceptionZero = false;
    this.exceptionPass = true;
    this.extArray = [];
    this.autArray = [];
    this.cpcArray = [];
    this.locArray = [];
    this.depArray = [];
    this.migArrayS = [];
    this.migArrayF = [];
    this.cliArray = [];
    this.typArray = [];
    if (event.target.checked) {
      this.searchService
        .getSearchResult(this.passwordPro)
        .subscribe((response: any) => {
          this.displaySearchResult = response.hits.hits.map((data) => ({
            fileName: data._source.resourcename,
            filePath: data._source.uri,
            lfUrl: data._source.lf_uri
              ? data._source.lf_uri instanceof Array
                ? data._source.lf_uri
                : [data._source.lf_uri]
              : data._source.lf_uri,
            lastModified: data._source.indexdate,
            dmsLinkID: data._source.dmsId,
            score: data._score,
            highlight: data.highlight,
            Author: data._source.author,
            mimeType: data._source.mimetype,
            streamSize: data._source.stream_size,
            created: data._source.createddate,
            indexed: data._source.indexdate,
            parent: data._source.parent,
            model: data._source.model,
            child: data._source.child,
            location: data._source.location,
            department: data._source.department,
          }));
          this.SearchResultCount = response.hits.total;
          this.displayData = this.SearchResultCount ? true : false;
        });
    } else {
      this.getData(this.keySearchValue, "");
    }
  }

  goDetailInfo(result, index) {
    this.resultDesc = result;
    this.selectedIndex = index;
  }

  closeDetailInfo() {
    this.resultDesc = false;
    $(".result_brief").removeClass("active");
  }

  clientFilter = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        this.aggregateClient
          .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
          .slice(0, 10)
      )
      // tslint:disable-next-line:semicolon
    );

  typeFilter = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map((term) =>
        this.aggregateType
          .filter((v) => v.toLowerCase().indexOf(term.toLowerCase()) > -1)
          .slice(0, 10)
      )
      // tslint:disable-next-line:semicolon
    );

  valueSelected(event: any, value: any, filterName: any) {
    this.pageCount = 1;
    if (!["ClientName", "Type"].includes(filterName)) {
      this.extenSelected = {
        ...this.extenSelected,
        [value]: event.target.checked,
      };
    }
    switch (filterName) {
      case "DocType":
        {
          if (event.target.checked && !this.extArray.includes(value)) {
            this.extArray = [...this.extArray, value];
          } else if (!event.target.checked && this.extArray.includes(value)) {
            {
              this.extArray = this.extArray.filter((data) => data !== value);
            }
          }
        }
        break;
      case "Author":
        {
          if (event.target.checked && !this.autArray.includes(value)) {
            this.autArray = [...this.autArray, value];
          } else if (!event.target.checked && this.autArray.includes(value)) {
            {
              this.autArray = this.autArray.filter((data) => data !== value);
            }
          }
        }
        break;
      case "Clientpartion":
        {
          if (event.target.checked && !this.cpcArray.includes(value)) {
            this.cpcArray = [...this.cpcArray, value];
          } else if (!event.target.checked && this.cpcArray.includes(value)) {
            {
              this.cpcArray = this.cpcArray.filter((data) => data !== value);
            }
          }
        }
        break;
      case "Location":
        {
          if (event.target.checked && !this.locArray.includes(value)) {
            this.locArray = [...this.locArray, value];
          } else if (!event.target.checked && this.locArray.includes(value)) {
            {
              this.locArray = this.locArray.filter((data) => data !== value);
            }
          }
        }
        break;
      case "Department":
        {
          if (event.target.checked && !this.depArray.includes(value)) {
            this.depArray = [...this.depArray, value];
          } else if (!event.target.checked && this.depArray.includes(value)) {
            {
              this.depArray = this.depArray.filter((data) => data !== value);
            }
          }
        }
        break;
      // case "MigratedF":
      //   {
      //     this.migArrayF = event.target.checked
      //       ? this.aggregateMigrated.notmigratedvalue
      //       : [];
      //     this.migArrayS = [];
      //     this.migrationSF = true;
      //     this.migrationSuccess = false;
      //     this.migrationFailed = true;
      //   }
      //   break;
      // case "MigratedS":
      //   {
      //     this.migArrayS = event.target.checked
      //       ? this.aggregateMigrated.migratedvalue
      //       : [];
      //     this.migArrayF = [];
      //     this.migrationSF = true;
      //     this.migrationSuccess = true;
      //     this.migrationFailed = false;
      //   }
      //   break;
      case "ClientName":
        {
          if (this.clientModel) {
            this.cliArray = [...new Set([...this.cliArray, event.item])];
          } else if (!this.clientModel) {
            {
              this.cliArray = this.cliArray.filter(
                (data) => data !== event.item
              );
            }
          }
        }
        break;
      case "Type":
        {
          if (this.typeModel) {
            this.typArray = [...new Set([...this.typArray, event.item])];
          } else if (!this.typeModel) {
            {
              this.typArray = this.typArray.filter(
                (data) => data !== event.item
              );
            }
          }
        }
        break;
    }
    this.getData(this.keySearchValue, "");
  }

  dateRange(dateRangedates: any) {
    const startDate = this.datePipe.transform(
      dateRangedates.start._d,
      "yyyy-MM-dd"
    );
    const endDate = this.datePipe.transform(
      dateRangedates.end._d,
      "yyyy-MM-dd"
    );
    this.dateField = { created: { from: startDate, to: endDate } };
    this.getData(this.keySearchValue, this.dateField);
    this.clearDate = true;
  }

  sort(sort: any) {
    if (sort === "desc") {
      this.sortName = "Oldest";
      this.sortNameList = "asc";
    } else if (sort === "asc") {
      this.sortName = "Recent";
      this.sortNameList = "desc";
    } else {
      this.sortName = "Recent";
      this.sortNameList = "desc";
    }

    this.sortObj = [
      {
        created: {
          order: sort,
        },
      },
    ];
    this.getData(this.keySearchValue, "");
  }

  clearAll() {
    this.extenSelected = {};
    this.exception = false;
    this.exceptionZero = false;
    this.exceptionPass = false;
    this.extArray = [];
    this.autArray = [];
    this.cpcArray = [];
    this.locArray = [];
    this.depArray = [];
    this.migArrayS = [];
    this.migArrayF = [];
    this.cliArray = [];
    this.typArray = [];
    this.migrationSuccess = false;
    this.migrationFailed = false;
    this.migrationSF = false;
    this.clientModel = "";
    this.typeModel = "";

    this.dateField = { indexed: { from: "", to: "" } };
    this.getData(this.keySearchValue, "");
    this.clearDate = false;
  }

  removeFromFilter(tag: any) {
    this.extenSelected[tag] = !this.extenSelected[tag];
    this.extArray = this.extArray.filter((dt) => dt !== tag);
    this.autArray = this.autArray.filter((dt) => dt !== tag);
    this.cpcArray = this.cpcArray.filter((dt) => dt !== tag);
    this.locArray = this.locArray.filter((dt) => dt !== tag);
    this.depArray = this.depArray.filter((dt) => dt !== tag);
    this.migArrayS = this.migArrayS.filter((dt) => dt !== tag);
    this.migArrayF = this.migArrayF.filter((dt) => dt !== tag);
    this.cliArray = this.cliArray.filter((dt) => dt !== tag);
    this.typArray = this.typArray.filter((dt) => dt !== tag);
    if (tag === "migrated") {
      this.migrationSuccess = false;
    }
    if (tag === "nonmigrated") {
      this.migrationFailed = false;
    }
    if (tag === "exceptionPass") {
      this.exceptionPass = false;
    }
    if (tag === "exceptionPass") {
      this.exceptionPass = false;
    }
    if (tag === "exceptionCorrupted") {
      this.exceptionCorrupted = false;
    }
    if (tag === "exceptionIgnored") {
      this.exceptionIgnored = false;
    }
    this.getData(this.keySearchValue, "");

    if (this.cliArray.length == 0) {
      this.clientModel = "";
    }
    if (this.typArray.length == 0) {
      this.typeModel = "";
    }
  }

  pageChange() {
    if (this.migrationSuccess) {
      this.getDataMigratedFiles(this.eventmigration);
    } else if (this.migrationFailed) {
      this.getDataNonMigratedFiles(this.eventnonmigration);
    } else if (this.exceptionCorrupted) {
      this.getDataCorrupted(this.eventcorrupted);
    } else if (this.exceptionIgnored) {
      this.getDataIgnoredFiles(this.eventignored);
    } else {
      this.getData(this.keySearchValue, "");
    }
  }

  ngOnDestroy() {
    if (this.source) {
      this.source.unsubscribe();
    }
  }

  fileEvent(url) {
    try {
      this.file.filePath = url;
      this.SpinnerService.show();
      const h = 500;
      const w = 800;
      const t = window.outerHeight / 2 + window.screenY - h / 2;
      const l = window.outerWidth / 2 + window.screenX - w / 2;
      this.classService.getFile(this.file).then(
        (response: any) => {
          const contentType = response.headers.get("Content-Type");
          const blob = response.body;
          console.log(response);
          if (blob.size > 0) {
            blob.lastModifiedDate = new Date();
            const iframe: any = document.createElement("iframe");
            const modifiedBlob = new Blob([blob], { type: contentType });
            const fileURL = URL.createObjectURL(modifiedBlob);

            console.log(blob);
            if (contentType === "content/unknown") {
              this.SpinnerService.hide();
              window.location.href = fileURL;
            } else {
              this.SpinnerService.hide();
              const newWindow = window.open(
                iframe,
                "Dynamic Popup",
                "height=" +
                  h +
                  ", width=" +
                  w +
                  ",top=" +
                  t +
                  ", left=" +
                  l +
                  " scrollbars=auto, resizable=no, location=no, status=no"
              );
              if (newWindow != null) {
                newWindow.document.write(
                  "<iframe width=100% height=100% src=" +
                    fileURL +
                    " allowfullscreen></iframe>"
                );
              } else {
                console.error("Pop up might be blocked");
              }
            }
          } else {
            return;
          }
        },
        (err) => {
          this.SpinnerService.hide();
          if (err.status === 404) {
            console.error("File not found");
          }
          if (err.status === 400) {
            console.error("IO Exception");
          }
          if (err.status === 500) {
            console.error(err);
          }
        }
      );
    } catch (err) {
      this.SpinnerService.hide();
      console.log(err);
    }
  }
}
