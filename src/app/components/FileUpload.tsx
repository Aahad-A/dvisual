import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload } from 'lucide-react'

interface FileUploadProps {
  onUpload: (file: File) => void
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = () => {
    if (file) {
      onUpload(file)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="file-upload">Upload CSV or JSON file</Label>
        <Input
          id="file-upload"
          type="file"
          accept=".csv,.json"
          onChange={handleFileChange}
          className="cursor-pointer file:text-sm file:font-medium"
        />
      </div>
      <Button onClick={handleUpload} disabled={!file} className="w-full max-w-sm">
        <Upload className="mr-2 h-4 w-4" /> Upload and Analyze
      </Button>
    </div>
  )
}