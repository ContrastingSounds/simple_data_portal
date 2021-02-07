import qs from 'query-string'

const logUrl = (url, context) => {
  console.log('logUrl()', url)
  console.log('hostUrl', context?.extensionSDK?.lookerHostData?.hostUrl)
  url = new URL(url, 'https://pebl.dev.looker.com')
  const params = url.searchParams.entries()
  console.log('--link:')
  console.log('  --pathname', url.pathname)
  console.log('  --search', url.search)
  console.log('    --fields', url.searchParams.get('fields').split(','))
  for(const entry of params) {
    if (entry[0].startsWith('f[')) {
      console.log(`    ${entry[0]}: ${entry[1]}`);
    }
  }
  console.log('    --dynamic fields', JSON.parse(url.searchParams.get('dynamic_fields')))
  console.log('    --vis config', JSON.parse(url.searchParams.get('vis_config')))
  console.log('    --limit', url.searchParams.get('limit'))
}

const parseExploreUrl = (url) => {
  const { limit, fields, dynamic_fields, reportTable } = params

  let exploreDefinition = {
    url: url,
    fields: fields.split(','),
    dynamicFields: dynamic_fields ? JSON.parse(dynamic_fields) : [],
    limit: limit,
    reportTable: reportTable === '1' ? true : false
  }
  
  return exploreDefinition
}

export { logUrl, parseExploreUrl }