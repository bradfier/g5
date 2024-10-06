import Papa from 'papaparse'

export async function processCsv(file: File) {
  const text = await file.text()

  const lines = text.split('\n')
  const header = lines.slice(0, 2)

  if (!header[0].startsWith('#info,log_version="1.00"')) {
    throw new Error('Invalid file format')
  }

  const rest = lines.slice(2).join('\n')

  const parsed = Papa.parse(rest)

  // If the date in the first column is before the 2019 GPS rollover, assume it's more recent
  // and add the corresponding 1024 weeks.
  const cutoffDate = new Date('2019-04-06')
  const millisecondsIn1024Weeks = 1024 * 7 * 24 * 60 * 60 * 1000

  let processedData = parsed.data.map(row => {
    const utcDate = new Date(row[0])

    if (utcDate < cutoffDate) {
      utcDate.setTime(utcDate.getTime() + millisecondsIn1024Weeks)
      row[0] = utcDate.toISOString().split('T')[0]
    }

    return row
  })

  // If the row contains the bogus Garmin Lat/Log value, remove it as it confuses later
  // processing steps.
  processedData = processedData.map(row => {
    const lat = row[4]
    const long = row[5]

    if (lat === '+39.0675011' && long === '-94.8976669') {
      row[4] = ''
      row[5] = ''
    }

    return row
  })

  let output = Papa.unparse(processedData, { newline: '\n' })
  output = `${header.join('\n')}\n${output}`

  const blob = new Blob([output], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name ? `FIXED_${file.name}` : 'processed.csv'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
