import React from 'react'
import { PieChart, pieArcLabelClasses } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
const MostBookedCourtType = () => {
  const sizing = {
    width: 450,
    height: 350,
  };
  return (
    <div className='bg-white md:mt-0 mt-4 p-2 h-full border-gray-400 rounded-xl shadow-md shadow-gray-700'>
      <h3 className='text-2xl font-bold text-gray-700'>Tỷ lệ đặt sân</h3>
      <PieChart
      colors={['#f9968b', '#f27348', '#76cdcd', '#f7ce76' ]}
        series={[
          {
            arcLabel: (item) => `${item.value}%`,
            // arcLabelMinAngle: 35,
            // arcLabelRadius: '60%',
            data: [
              { id: 0, value: 10, label: 'series A' },
              { id: 1, value: 15, label: 'series B' },
              { id: 2, value: 20, label: 'series C' },
              { id: 4, value: 30, label: 'series D' },
            ],
            innerRadius: 40,
            outerRadius: 120,
            paddingAngle: 3,
            cornerRadius: 4,
          },
        ]}
        sx={{
          [`& .${pieArcLabelClasses.root}`]: {
            fill: 'white',
            fontSize: 17,
          },
        }}
        {...sizing}
      >
      </PieChart>
    </div>
  )
}

export default MostBookedCourtType

