import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
  } from "recharts";
  
  export function Chart({ data }) {

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{
            right: 20,
            left: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="vwap24Hr" fill="#00D1FF" />
          <Bar dataKey="priceUsd" fill="#0038FF" />
        </BarChart>
      </ResponsiveContainer>
    );
  }