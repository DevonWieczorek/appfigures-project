import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { GroupedReviews, ReviewItem } from "@/types/reviews"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getReviewGroupLabel(dateString: string, now = new Date()) {
  const date = new Date(dateString)

  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)

  const startOfYesterday = new Date(startOfToday)
  startOfYesterday.setDate(startOfYesterday.getDate() - 1)

  const startOfLastWeek = new Date(startOfToday)
  startOfLastWeek.setDate(startOfLastWeek.getDate() - 7)

  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  if (date >= startOfToday) return "Today"
  if (date >= startOfYesterday && date < startOfToday) return "Yesterday"
  if (date >= startOfLastWeek && date < startOfYesterday) return "Last week"
  if (date >= startOfLastMonth && date < startOfThisMonth) return "Last month"

  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  })
}

export function groupReviews(reviews: ReviewItem[]): GroupedReviews[] {
  const grouped = new Map<string, ReviewItem[]>();

  for (const review of reviews) {
    const label = getReviewGroupLabel(review.date)
    const current = grouped.get(label) ?? []
    grouped.set(label, [...current, review])
  }

  return Array.from(grouped, ([label, items]) => ({ label, items }))
}