"use client"

import { useEffect, useRef } from "react"
import Chart from "chart.js/auto"
import "./pie-chart.css"

interface PieChartProps {
  data: {
    labels: string[]
    values: number[]
    colors?: string[]
  }
  title?: string
}

export default function PieChart({ data, title }: PieChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  // Default colors that match the image
  const defaultColors = [
    "rgba(18, 36, 72, 1)", // Dark navy/purple
    "rgba(75, 192, 192, 1)", // Teal/turquoise
    "rgba(54, 162, 235, 0.8)", // Blue
  ]

  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }

      const ctx = chartRef.current.getContext("2d")

      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: "pie",
          data: {
            labels: data.labels,
            datasets: [
              {
                data: data.values,
                backgroundColor: data.colors || defaultColors,
                borderWidth: 0,
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
              title: {
                display: !!title,
                text: title || "",
                color: "#fff",
                font: {
                  size: 16,
                },
              },
              tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                titleColor: "#fff",
                bodyColor: "#fff",
                callbacks: {
                  label: (context) => {
                    const label = context.label || ""
                    const value = context.raw
                    const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                    const percentage = Math.round(((value as number) / total) * 100)
                    return `${label}: ${percentage}%`
                  },
                },
              },
            },
          },
        })
      }
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, title])

  return (
    <div className="pie-chart-container">
      <canvas ref={chartRef}></canvas>
    </div>
  )
}

