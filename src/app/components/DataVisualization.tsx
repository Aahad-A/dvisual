'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AnalysisData {
  summary?: Record<string, Record<string, number>>;
  column_types?: Record<string, string>;
  missing_values?: Record<string, number>;
  correlation_heatmap?: string;
  correlation_matrix?: Record<string, Record<string, number>>;
  skewness?: Record<string, number>;
  kurtosis?: Record<string, number>;
  residuals?: string;
  histograms?: Record<string, string>;
  feature_importance?: Record<string, number>;
  columns?: string[];
}

export interface AnalysisOptions {
  summary: boolean;
  columnTypes: boolean;
  missingValues: boolean;
  correlationHeatmap: boolean;
  correlationMatrix: boolean;
  skewnessKurtosis: boolean;
  featureImportance: boolean;
  residuals: boolean;
  histograms: boolean;
  targetColumn?: string;
}

interface DataVisualizationProps {
  data: AnalysisData;
  onAnalyze: (options: AnalysisOptions) => void;
}

export default function DataVisualization({ data, onAnalyze }: DataVisualizationProps) {
  const [analysisOptions, setAnalysisOptions] = useState<AnalysisOptions>({
    summary: true,
    columnTypes: true,
    missingValues: true,
    correlationHeatmap: true,
    correlationMatrix: true,
    skewnessKurtosis: true,
    featureImportance: true,
    residuals: true,
    histograms: true,
  })
  const [targetColumn, setTargetColumn] = useState<string>('')

  useEffect(() => {
    console.log('Data received:', data)
    console.log('Analysis options:', analysisOptions)
    console.log('Target column:', targetColumn)
    console.log('Available columns:', data.columns)
  }, [data, analysisOptions, targetColumn])

  const handleOptionChange = useCallback((option: keyof AnalysisOptions) => {
    setAnalysisOptions(prev => ({ ...prev, [option]: !prev[option] }))
  }, [])

  const handleAnalyze = useCallback(() => {
    console.log('Analyzing with options:', { ...analysisOptions, targetColumn })
    onAnalyze({ ...analysisOptions, targetColumn })
  }, [analysisOptions, targetColumn, onAnalyze])

  const renderAccordionItem = useCallback((key: string, title: string, content: React.ReactNode) => (
    <AccordionItem value={key} className="bg-gray-800/50 backdrop-blur-sm border-gray-700 rounded-lg">
      <AccordionTrigger className="px-4 py-2 hover:bg-gray-700/50 rounded-t-lg">{title}</AccordionTrigger>
      <AccordionContent className="p-4">
        {content}
      </AccordionContent>
    </AccordionItem>
  ), [])

  return (
    <div className="space-y-8">
      <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-100">Analysis Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {Object.entries(analysisOptions).map(([key, value]) => (
              <div className="flex items-center space-x-2" key={key}>
                <Checkbox
                  id={key}
                  checked={value}
                  onCheckedChange={() => handleOptionChange(key as keyof AnalysisOptions)}
                  aria-label={`Toggle ${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}`}
                />
                <label
                  htmlFor={key}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </label>
              </div>
            ))}
          </div>
          {(analysisOptions.featureImportance || analysisOptions.residuals) && (
            <div className="mb-4">
              <label htmlFor="target-column" className="block text-sm font-medium mb-2">
                Target Column for Feature Importance and Residuals
              </label>
              <Select onValueChange={setTargetColumn} value={targetColumn}>
                <SelectTrigger id="target-column">
                  <SelectValue placeholder="Select target column" />
                </SelectTrigger>
                <SelectContent>
                  {data.columns?.map((column) => (
                    <SelectItem key={column} value={column}>
                      {column}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Button onClick={handleAnalyze} className="w-full">Analyze</Button>
        </CardContent>
      </Card>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {data.correlation_heatmap && analysisOptions.correlationHeatmap && renderAccordionItem(
          "correlation-heatmap",
          "Correlation Heatmap",
          <Image
            src={`data:image/png;base64,${data.correlation_heatmap}`}
            alt="Correlation Heatmap"
            width={600}
            height={480}
            className="mx-auto"
          />
        )}

        {data.summary && analysisOptions.summary && renderAccordionItem(
          "summary",
          "Summary Statistics",
          <ScrollArea className="h-[300px] rounded-md border border-gray-700 p-4">
            <pre className="text-sm">{JSON.stringify(data.summary, null, 2)}</pre>
          </ScrollArea>
        )}

        {data.column_types && analysisOptions.columnTypes && renderAccordionItem(
          "column-types",
          "Column Types",
          <ScrollArea className="h-[300px] rounded-md border border-gray-700 p-4">
            <pre className="text-sm">{JSON.stringify(data.column_types, null, 2)}</pre>
          </ScrollArea>
        )}

        {data.missing_values && analysisOptions.missingValues && renderAccordionItem(
          "missing-values",
          "Missing Values",
          <ScrollArea className="h-[300px] rounded-md border border-gray-700 p-4">
            <pre className="text-sm">{JSON.stringify(data.missing_values, null, 2)}</pre>
          </ScrollArea>
        )}

        {data.correlation_matrix && analysisOptions.correlationMatrix && renderAccordionItem(
          "correlation-matrix",
          "Correlation Matrix",
          <ScrollArea className="h-[300px] rounded-md border border-gray-700 p-4">
            <pre className="text-sm">{JSON.stringify(data.correlation_matrix, null, 2)}</pre>
          </ScrollArea>
        )}

        {data.skewness && data.kurtosis && analysisOptions.skewnessKurtosis && renderAccordionItem(
          "skewness-kurtosis",
          "Skewness and Kurtosis",
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold mb-2">Skewness</h4>
              <ScrollArea className="h-[200px] rounded-md border border-gray-700 p-4">
                <pre className="text-sm">{JSON.stringify(data.skewness, null, 2)}</pre>
              </ScrollArea>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Kurtosis</h4>
              <ScrollArea className="h-[200px] rounded-md border border-gray-700 p-4">
                <pre className="text-sm">{JSON.stringify(data.kurtosis, null, 2)}</pre>
              </ScrollArea>
            </div>
          </div>
        )}

        {data.histograms && analysisOptions.histograms && renderAccordionItem(
          "histograms",
          "Histograms",
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(data.histograms).map(([column, histogram]) => (
              <div key={column}>
                <h4 className="font-semibold mb-2">{column}</h4>
                <Image
                  src={`data:image/png;base64,${histogram}`}
                  alt={`Histogram of ${column}`}
                  width={400}
                  height={300}
                />
              </div>
            ))}
          </div>
        )}

        {data.residuals && analysisOptions.residuals && targetColumn && renderAccordionItem(
          "residuals",
          `Residuals (Target: ${targetColumn})`,
          <Image
            src={`data:image/png;base64,${data.residuals}`}
            alt={`Residuals for ${targetColumn}`}
            width={600}
            height={400}
          />
        )}

        {data.feature_importance && analysisOptions.featureImportance && targetColumn && renderAccordionItem(
          "feature-importance",
          `Feature Importance (Target: ${targetColumn})`,
          <ScrollArea className="h-[300px] rounded-md border border-gray-700 p-4">
            <pre className="text-sm">{JSON.stringify(data.feature_importance, null, 2)}</pre>
          </ScrollArea>
        )}
      </Accordion>
    </div>
  )
}