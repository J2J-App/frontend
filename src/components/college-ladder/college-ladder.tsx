import React, { useState, useCallback } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter
} from 'recharts';
import styles from './college-ladder.module.css';

interface CollegeData {
  name: string;
  rank: number;
  trend: string;
  cluster: string;
  probability?: number;
  branch?: string;
  type?: string;
}

interface CollegeLadderProps {
  data: CollegeData[];
  onCollegeHover?: (college: CollegeData | null) => void;
  onCollegeClick?: (college: CollegeData) => void;
}

const CollegeLadder: React.FC<CollegeLadderProps> = ({ 
  data, 
  onCollegeHover, 
  onCollegeClick
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedCollege, setSelectedCollege] = useState<CollegeData | null>(null);



  // Transform data to include index for X-axis and color coding
  const chartData = data.map((item, index) => ({
    ...item,
    index: index + 1,
    displayName: `${index + 1}. ${item.name}`,
    color: getColorByProbability(item.probability || 0),
    clusterValue: getClusterValue(item.cluster),
    trendValue: getTrendValue(item.trend)
  }));

  // Color coding based on probability
  function getColorByProbability(probability: number): string {
    if (probability >= 0.7) return '#22c55e'; // Green - High probability
    if (probability >= 0.4) return '#fbbf24'; // Yellow - Medium probability
    return '#ef4444'; // Red - Low probability
  }

  // Convert cluster percentage to numeric value
  function getClusterValue(cluster: string): number {
    const match = cluster.match(/(\d+)%/);
    return match ? parseInt(match[1]) : 0;
  }

  // Convert trend to numeric value for visualization
  function getTrendValue(trend: string): number {
    switch (trend.toLowerCase()) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 2;
    }
  }

  // Custom tooltip component with enhanced information
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length && payload[0]) {
      const data = payload[0].payload;
      return (
        <div className={styles.customTooltip}>
          <div className={styles.tooltipHeader}>
            <h4 className={styles.tooltipTitle}>{data.name}</h4>
            <span className={`${styles.tooltipTrend} ${styles[data.trend]}`}>
              {data.cluster}
            </span>
          </div>
          <div className={styles.tooltipContent}>
            <div className={styles.tooltipRow}>
              <span className={styles.tooltipLabel}>Rank:</span>
              <span className={styles.tooltipValue}>{data.rank}</span>
            </div>
            <div className={styles.tooltipRow}>
              <span className={styles.tooltipLabel}>Probability:</span>
              <span className={styles.tooltipValue}>{data.clusterValue}%</span>
            </div>
            <div className={styles.tooltipRow}>
              <span className={styles.tooltipLabel}>Trend:</span>
              <span className={`${styles.tooltipValue} ${styles[data.trend]}`}>
                {data.trend.charAt(0).toUpperCase() + data.trend.slice(1)}
              </span>
            </div>
            {data.branch && (
              <div className={styles.tooltipRow}>
                <span className={styles.tooltipLabel}>Branch:</span>
                <span className={styles.tooltipValue}>{data.branch}</span>
              </div>
            )}
            {data.type && (
              <div className={styles.tooltipRow}>
                <span className={styles.tooltipLabel}>Type:</span>
                <span className={styles.tooltipValue}>{data.type}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Handle mouse events
  const handleMouseEnter = useCallback((data: any, index: number) => {
    setHoveredIndex(index);
    if (onCollegeHover) {
      onCollegeHover(data);
    }
  }, [onCollegeHover]);

  const handleMouseLeave = useCallback(() => {
    setHoveredIndex(null);
    if (onCollegeHover) {
      onCollegeHover(null);
    }
  }, [onCollegeHover]);

  const handleClick = useCallback((data: any) => {
    setSelectedCollege(data);
    if (onCollegeClick) {
      onCollegeClick(data);
    }
  }, [onCollegeClick]);

  // Keyboard navigation handler
  const handleKeyDown = useCallback((event: React.KeyboardEvent, data: any) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick(data);
    }
  }, [handleClick]);

  return (
    <div className={styles.collegeLadderContainer}>

      {/* College List Section */}
      <div className={styles.collegeList}>
        <h3 className={styles.sectionTitle}>
          Probable Colleges (Top {data.length})
        </h3>
        <div 
          className={styles.collegeGrid}
          role="grid"
          aria-label="College probability list"
        >
          {data.length === 0 ? (
            <div className={styles.emptyState}>
              <span className={styles.emptyIcon}>🔍</span>
              <p>No colleges found.</p>
              <p className={styles.emptyHint}>No data available to display.</p>
            </div>
          ) : (
            data.map((college, index) => {
              return (
                <div 
                  key={`${college.name}-${index}`} 
                  className={`${styles.collegeItem} ${
                    hoveredIndex === index ? styles.hovered : ''
                  } ${
                    selectedCollege?.name === college.name ? styles.selected : ''
                  }`}
                  role="gridcell"
                  tabIndex={0}
                  aria-label={`${college.name}, ${college.cluster} admission probability, rank ${college.rank}`}
                  onClick={() => handleClick(college)}
                  onMouseEnter={() => handleMouseEnter(college, index)}
                  onMouseLeave={handleMouseLeave}
                  onKeyDown={(e) => handleKeyDown(e, college)}
                >
                  <div className={styles.collegeNumber} aria-hidden="true">{index + 1}</div>
                  <div className={styles.collegeInfo}>
                    <div className={styles.collegeName}>
                      {college.name}
                      {college.branch && (
                        <span className={styles.branchName}> - {college.branch}</span>
                      )}
                    </div>
                    <div className={styles.collegeDetails}>
                      <span className={`${styles.trend} ${styles[college.trend]}`}>
                        {college.cluster}
                      </span>
                      <span className={styles.rank} aria-label={`Cutoff rank ${college.rank}`}>
                        Rank: {college.rank}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Interactive Chart Section */}
      <div className={styles.chartSection}>
        <h3 className={styles.sectionTitle}>
          Interactive Rank Distribution
        </h3>
        <div 
          role="img" 
          aria-label="Interactive bar chart showing college ranks and admission probabilities"
          className={styles.chartContainer}
        >
          <ResponsiveContainer width="100%" height={450}>
            <BarChart
              data={chartData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
              onMouseMove={(state) => {
                if (state && state.activeTooltipIndex !== undefined && state.activeTooltipIndex !== null) {
                  const index = state.activeTooltipIndex as number;
                  if (chartData[index]) {
                    handleMouseEnter(chartData[index], index);
                  }
                }
              }}
              onMouseLeave={handleMouseLeave}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="index" 
                tick={{ fill: '#fff', fontSize: 12 }}
                axisLine={{ stroke: '#8884d8' }}
                tickLine={{ stroke: '#8884d8' }}
                aria-label="College sequence number"
              />
              <YAxis 
                tick={{ fill: '#fff', fontSize: 12 }}
                axisLine={{ stroke: '#8884d8' }}
                tickLine={{ stroke: '#8884d8' }}
                label={{ 
                  value: 'Cutoff Rank', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { textAnchor: 'middle', fill: '#fff' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ color: '#fff' }}
                formatter={(value) => <span style={{ color: '#fff' }}>{value}</span>}
              />
              <Bar 
                dataKey="rank" 
                name="Cutoff Rank"
                cursor="pointer"
                onClick={handleClick}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke={hoveredIndex === index ? '#fff' : 'none'}
                    strokeWidth={hoveredIndex === index ? 2 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CollegeLadder;