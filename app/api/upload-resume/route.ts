import { NextResponse } from 'next/server'
import Airtable from 'airtable'

export async function POST(req: Request) {
  try {
    const { content } = await req.json()

    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!)

    const records = await base('ResHelp2').select({
      filterByFormula: '{Resume} = ""',
      maxRecords: 1
    }).firstPage()

    if (records.length === 0) {
      // Create a new record if no empty fields are found
      await base('ResHelp2').create([
        {
          fields: {
            Resume: content
          }
        }
      ])
    } else {
      // Update the first empty record
      await base('ResHelp2').update([
        {
          id: records[0].id,
          fields: {
            Resume: content
          }
        }
      ])
    }

    return NextResponse.json({ message: 'Resume uploaded successfully' })
  } catch (error) {
    console.error('Error uploading resume:', error)
    return NextResponse.json({ error: 'Failed to upload resume' }, { status: 500 })
  }
}