import { BarChart3 } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface BarChartProps {
  barData: {
    name: string
    value: number
    color?: string
  }[]
  title: string
}

export default function BarChartCompo({ barData, title }: BarChartProps) {
  return (
    <Card className="border border-gray-200 rounded-xl shadow-none w-full">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
        <CardTitle className="flex items-center gap-2 text-slate-800">
          <BarChart3 className="w-5 h-5 text-green-500" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid stroke="#f3f4f6" />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <YAxis
                dataKey="value"
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
              />
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar
                dataKey="value"
                radius={[15, 15, 0, 0]}
                label={{ position: "top" }}
              >
                {barData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || "#3b82f6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
