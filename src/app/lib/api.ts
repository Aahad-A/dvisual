import { AnalysisOptions } from '../components/DataVisualization'

export async function analyzeData(file: File, options?: AnalysisOptions) {
  const formData = new FormData()
  formData.append('file', file)
  
  if (options) {
    formData.append('options', JSON.stringify(options))
  }

  const response = await fetch('/api/analyze', {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to analyze data')
  }

  return response.json()
}