import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  
  const response = await fetch('http://localhost:5000/analyze', {
    method: 'POST',
    body: formData,
  })

  const data = await response.json()
  return NextResponse.json(data)
}