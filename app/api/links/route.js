import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const links = await prisma.link.findMany()
    return new Response(JSON.stringify(links), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'An error occurred while fetching the links' }), { status: 500 })
  }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const link = await prisma.link.create({ data: body })
    return new Response(JSON.stringify(link), { status: 201 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'An error occurred while creating the link' }), { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const body = await req.json()
    const link = await prisma.link.update({ where: { id: body.id }, data: body })
    return new Response(JSON.stringify(link), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'An error occurred while updating the link' }), { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json()
    const link = await prisma.link.delete({ where: { id: body.id } })
    return new Response(JSON.stringify(link), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: 'An error occurred while deleting the link' }), { status: 500 })
  }
}
