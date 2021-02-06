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

export { logUrl }