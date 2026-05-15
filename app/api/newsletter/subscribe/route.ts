import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

const subscribeSchema = z.object({
  email: z.string().email(),
  frequency: z.enum(['IMMEDIATE', 'DAILY', 'WEEKLY', 'NEVER']).default('DAILY'),
  preferences: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = subscribeSchema.parse(body)

    // Check if subscription already exists
    const existingSubscription = await prisma.newsletterSubscription.findUnique({
      where: { email: validatedData.email },
    })

    if (existingSubscription) {
      // Update existing subscription
      const updatedSubscription = await prisma.newsletterSubscription.update({
        where: { email: validatedData.email },
        data: {
          frequency: validatedData.frequency,
          preferences: validatedData.preferences,
          active: true,
        },
      })

      return NextResponse.json({
        message: 'Subscription updated successfully',
        subscription: updatedSubscription,
      })
    }

    // Create new subscription
    const subscription = await prisma.newsletterSubscription.create({
      data: {
        email: validatedData.email,
        frequency: validatedData.frequency,
        preferences: validatedData.preferences,
        active: true,
      },
    })

    return NextResponse.json({
      message: 'Subscription created successfully',
      subscription,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.issues },
        { status: 400 }
      )
    }

    console.error('Error creating newsletter subscription:', error)
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = await request.nextUrl.searchParams
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    await prisma.newsletterSubscription.update({
      where: { email },
      data: { active: false },
    })

    return NextResponse.json({
      message: 'Subscription cancelled successfully',
    })
  } catch (error) {
    console.error('Error cancelling newsletter subscription:', error)
    return NextResponse.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}