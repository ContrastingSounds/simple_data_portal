const pop = {
  UPDATE_RANGE: 'update_range',
  UPDATE_BREAKDOWN: 'update_breakdown',
  UPDATE_COMPARISON: 'update_comparison',
  UPDATE_FREE_RANGE: 'update_free_range',

  YTD: 'ytd',
  MTD: 'mtd',

  LAST_MONTH: 'last_month',
  _03_MONTHS: 'threeMonths',
  _06_MONTHS: 'sixMonths',
  _12_MONTHS: 'twelveMonths',
  _24_MONTHS: 'twentyfourMonths',
  FREE_RANGE: 'free_range',

  YOY: 'yoy',
  VS_PREVIOUS: 'vs_previous',

  NO_COMPARISON: 'no_comparison',

  NO_BREAKDOWN: 'no_breakdown',
  BY_WEEK: 'by_week',
  BY_MONTH: 'by_month',
}

const getDateRanges = (range, comparison='no_comparison') => {
  console.log('getDateRanges(range, comparison)', range, comparison)
  let ranges = []

  switch (range) {
    case 'YTD':
      ranges.push([new Date(2021, 0, 1), new Date(2021, 0, 31)])
      break
    default:
      ranges.push([new Date(2021, 0, 1), new Date(2021, 0, 31)])
  }
  
  if ([pop.YOY, pop.VS_PREVIOUS].includes(comparison)) {
    ranges = ranges.concat([
      [new Date(2020, 0, 1), new Date(2020, 0, 31)],
      [new Date(2019, 0, 1), new Date(2019, 0, 31)],
      [new Date(2018, 0, 1), new Date(2018, 0, 31)],
    ])
  } else {
    ranges = ranges.concat([ [], [], [] ])
  }

  return ranges
}

export { pop, getDateRanges }