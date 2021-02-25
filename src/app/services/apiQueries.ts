export class APIQueries {
  // Dashboard Queries
  // Total Source count
  public static sourceObj = {
    size: 0,
    aggs: {
      repo_count: {
        cardinality: {
          field: 'location.keyword',
        },
      },
    },
  };
  // Total discovered count
  public static discoveredObj = {};
  // Total Migrated count
  public static migratedObj = {
    query: {
      bool: {
        must: [
          {
            exists: {
              field: 'dmsId',
            },
          },
        ],
      },
    },
  };
  // Total Document Trained count
  public static trainedObj = {
    size: 0,
    aggs: {
      by_model: {
        cardinality: {
          field: 'model.keyword'
        }
      }
    }
  };

  // Top 5 Department Volume
  public static departmentObj = {
    size: 0,
    aggs: {
      by_source: {
        terms: {
          field: 'department.keyword',
          size: 5,
        },
      },
    },
  };
  // Top Data source
  public static dataSourceObj = {
    size: 0,
    aggs: {
      by_source: {
        terms: {
          field: 'location.keyword',
          size: 5,
        },
      },
    },
  };
  public static dataModelObj = {
    size: 0,
    aggs: {
      by_model: {
        terms: {
          field: 'model.keyword',
          size: 5
        }
      }
    }
  };
  // Trained Document Sets
  public static trainedSetsObj = {
    size: 0,
    query: {
      bool: {
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
  // Zero Kb files
  public static zeroKbFilesObj = {
    query: {
      bool: {
        should: [{ match: { stream_size: 0 } }],
      },
    },
  };
  // Password protected files
  public static passwordProtectedObj = {
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

  // Corrupted file
  public static corruptedFilesObj = {
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

  // Total Document ignored count
  public static ignoredFilesObj = {
    query: {
      bool: {
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

  // Discovered data for Chart
  public static discoveredChartObj = {
    size: 0,
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

  // migratedChartObj
  public static migratedChartObj = {
    size: 0,
    query: {
      bool: {
        should: [{ match: { migration: 1 } }],
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
}
