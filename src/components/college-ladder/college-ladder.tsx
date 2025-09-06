
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface CollegeData {
  name: string;
  rank: number;
  trend: string;
  cluster: string;
}

interface CollegeLadderProps {
  data: CollegeData[];
}

const CollegeLadder: React.FC<CollegeLadderProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip
          contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '5px' }}
          labelStyle={{ color: '#fff' }}
          itemStyle={{ color: '#fff' }}
        />
        <Legend />
        <Bar dataKey="rank" fill="#8884d8" name="College Rank" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CollegeLadder;
