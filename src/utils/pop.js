import { 
  startOfToday,
  startOfMonth,
  startOfYear,

  endOfMonth,

  subMonths,
  subYears,
} from 'date-fns'


const pop = {
  // REDUCER ACTIONS
  actions: {
    UPDATE_RANGE: 'update_range',
    UPDATE_BREAKDOWN: 'update_breakdown',
    UPDATE_COMPARISON: 'update_comparison',
    UPDATE_FREE_RANGE: 'update_free_range',
  },

  // RANGE OPTIONS
  ranges: {
    YTD: 'ytd',
    MTD: 'mtd',
  
    LAST_MONTH: 'lastMonth',
    _03_MONTHS: 'months03',
    _06_MONTHS: 'months06',
    _12_MONTHS: 'months12',
    _24_MONTHS: 'months24',
    FREE_RANGE: 'freeRange',
  },

  // COMPARISON OPTIONS
  comparisons: {
    NO_COMPARISON: 'noComparison',
    YOY: 'yoy',
    // VS_PREVIOUS: 'vs_previous',
  },

  // BREAKDOWN OPTIONS
  breakdowns: {
    NO_BREAKDOWN: 'noBreakdown',
    BY_WEEK: 'byWeek',
    BY_MONTH: 'byMonth',
  }
}

const popLabels = {
  ranges: [
    { label: 'YTD', value: pop.ranges.YTD},
    { label: 'This MTD', value: pop.ranges.MTD},
    { label: 'Last Month', value: pop.ranges.LAST_MONTH},
    { label: '3 Months', value: pop.ranges._03_MONTHS},
    { label: '6 Months', value: pop.ranges._06_MONTHS},
    { label: '12 Months', value: pop.ranges._12_MONTHS},
    { label: '24 Months', value: pop.ranges._24_MONTHS},
    { label: '(free range)', value: pop.ranges.FREE_RANGE},
  ],
  breakdowns: [
    { label: '(select breakdown)', value: pop.breakdowns.NO_BREAKDOWN},
    { label: 'by Week', value: pop.breakdowns.BY_WEEK},
    { label: 'by Month', value: pop.breakdowns.BY_MONTH},
  ],
  comparisons: [
    { label: '(select comparison)', value: pop.comparisons.NO_COMPARISON },
    { label: 'YoY', value: pop.comparisons.YOY },
    // { label: 'vs. Previous', value: pop.comparisons.VS_PREVIOUS },
  ]
}


const getDateRanges = (range, comparison=pop.comparisons.NO_COMPARISON) => {
  // console.log('getDateRanges(range, comparison)', range, comparison)
  
  const today = startOfToday()
  const start_of_month = startOfMonth(today)
  const start_of_year = startOfYear(today)
  
  let currentRange = []
  switch (range) {
    case pop.ranges.YTD:
      currentRange = [start_of_year, today]
      break
    case pop.ranges.MTD:
      currentRange = [start_of_month, today]
      break
    case pop.ranges.LAST_MONTH:
      const start_of_last_month = subMonths(start_of_month, 1)
      currentRange = [start_of_last_month, endOfMonth(start_of_last_month)]
      break
    case pop.ranges._03_MONTHS:
      currentRange = [subMonths(start_of_month, 2), today]
      break
    case pop.ranges._06_MONTHS:
      currentRange = [subMonths(start_of_month, 5), today]
      break
    case pop.ranges._12_MONTHS:
      currentRange = [subMonths(start_of_month, 11), today]
      break
    case pop.ranges._24_MONTHS:
      currentRange = [subMonths(start_of_month, 23), today]
      break
    default:
      // console.warn('WARNING: getDateRange() returning default YTD for range', range)
      currentRange = [start_of_year, today]
  }
  
  let newRanges = [currentRange]
  if ([pop.comparisons.YOY, pop.comparisons.VS_PREVIOUS].includes(comparison)) {
    // console.log('getDateRanges() ready to loop through periods for', comparison)
    for (let i=1; i<4; i++) {
      // console.log('Calculating Comparison Period', i)
      const diff = range == pop.ranges._24_MONTHS ? 2 * i : i
      const comparisonPeriod = [subYears(currentRange[0], diff), subYears(currentRange[1], diff)]
      newRanges.push(comparisonPeriod)
      // console.log('pushed to newRanges', newRanges)
    }
  } else {
    newRanges = [ currentRange, [], [], [] ]
  }

  // console.log('getDateRanges() result:', newRanges)
  return newRanges
}

export { pop, popLabels, getDateRanges }
