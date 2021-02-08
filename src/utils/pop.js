import { 
  startOfToday,
  startOfMonth,
  startOfYear,

  endOfMonth,

  getDay,
  getDate,
  getDayOfYear,

  startOfYesterday,

  addDays,
  subDays,
  addMonths,
  subMonths,
  addYears,
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
  
    LAST_MONTH: 'last_month',
    _03_MONTHS: 'threeMonths',
    _06_MONTHS: 'sixMonths',
    _12_MONTHS: 'twelveMonths',
    _24_MONTHS: 'twentyfourMonths',
    FREE_RANGE: 'free_range',
  },

  // COMPARISON OPTIONS
  comparisons: {
    YOY: 'yoy',
    VS_PREVIOUS: 'vs_previous',
    NO_COMPARISON: 'no_comparison',
  },

  // BREAKDOWN OPTIONS
  breakdowns: {
    NO_BREAKDOWN: 'no_breakdown',
    BY_WEEK: 'by_week',
    BY_MONTH: 'by_month',
  }
}




const getDateRanges = (range, comparison='no_comparison') => {
  console.log('getDateRanges(range, comparison)', range, comparison)
  
  const today = startOfToday()
  const today_of_week = getDay(today)
  const today_of_month = getDate(today)
  const today_of_year = getDayOfYear(today)

  const yesterday = startOfYesterday()
  const yesterday_of_week = getDay(yesterday)
  const yesterday_of_month = getDay(yesterday)
  const yesterday_of_year = getDayOfYear(yesterday)

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
      console.warn('WARNING: getDateRange() returning default YTD for range', range)
      currentRange = [start_of_year, today]
  }
  
  let newRanges = [currentRange]
  if ([pop.comparisons.YOY, pop.comparisons.VS_PREVIOUS].includes(comparison)) {
    console.log('getDateRanges() ready to loop through periods for', comparison)
    for (let i=0; i<3; i++) {
      console.log('Calculating Comparison Period', i)
      const comparisonPeriod = [new Date(2020 - i, 0, 1), new Date(2020 - i, 0, 31)]
      newRanges.push(comparisonPeriod)
      console.log('pushed to newRanges', newRanges)
    }
  } else {
    newRanges = [ currentRange, [], [], [] ]
  }

  console.log('getDateRanges() result:', newRanges)
  return newRanges
}

const retailYear = () => {}
const retailYearStart = () => {}

const retailDayOfWeek = () => {}
const retailDayOfYear = () => {}

const retailWeekNumber = () => {}
const retailWeekStart = () => {}
const retailWeekEnd = () => {}

const retailMonthNumber = () => {}
const retailMonthStart = () => {}
const retailMonthEnd = () => {}

const retailQuarterNumber = () => {}

export { pop, getDateRanges }
