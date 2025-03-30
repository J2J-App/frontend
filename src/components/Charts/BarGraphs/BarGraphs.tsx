"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"
import { CategoryScale } from "chart.js"
import styles from "./bargraph.module.css"

Chart.register(CategoryScale)

interface GradientBarChartProps {
  data: number[]
  labels?: string[]
  showLabels?: boolean
  title?: string
  maxValue?: number
  colors?: {
    startColor: string
    endColor: string
  }
}

export default function GradientBarChart({
  data = [],
  labels = [],
  showLabels = false,
  title = "",
  maxValue = 100,
  colors = {
    startColor: "rgba(64, 192, 160, 1)", // Teal/green at top
    endColor: "rgba(128, 64, 192, 1)", // Purple at bottom
  },
}: GradientBarChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  // Generate default labels if none provided
  const chartLabels =
    labels.length === data.length ? labels : Array.from({ length: data.length }, (_, i) => `Item ${i + 1}`)

  useEffect(() => {
    if (!chartRef.current) return

    // Cleanup previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    const ctx = chartRef.current.getContext("2d")
    if (!ctx) return

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, colors.startColor)
    gradient.addColorStop(1, colors.endColor)

    // Create chart
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: chartLabels,
        datasets: [
          {
            data: data,
            backgroundColor: gradient,
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            titleColor: "white",
            bodyColor: "white",
            padding: 10,
            cornerRadius: 4,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              display: showLabels,
              color: "rgba(255, 255, 255, 0.7)",
              font: {
                size: 12,
              },
            },
            border: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            max: maxValue,
            grid: {
              color: "rgba(255, 255, 255, 0.1)",
            },
            border: {
              display: false,
            },
            ticks: {
              color: "rgba(255, 255, 255, 0.7)",
              padding: 10,
              font: {
                size: 12,
              },
              stepSize: maxValue / 5,
            },
          },
        },
      },
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, chartLabels, showLabels, maxValue, colors])

  return (
    <div className={styles.chartContainer}>
      {title && <h2 className={styles.chartTitle}>{title}</h2>}
      <canvas ref={chartRef}></canvas>
    </div>
  )
}

