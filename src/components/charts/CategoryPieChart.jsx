import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useTheme } from '../../hooks/useTheme';
import { CHART_COLORS, CATEGORY_LABELS } from '../../constants/ui';

const CategoryPieChart = ({ data, title, exportId }) => {
  const { isDark } = useTheme();

  const chartData = Object.entries(data ?? {}).map(([key, value]) => ({
    name: CATEGORY_LABELS[key] ?? key,
    value: Math.round(value * 10) / 10,
    color: CHART_COLORS[key] ?? '#10b981',
  }));

  return (
    <div id={exportId} className="glass-card p-6 bg-white dark:bg-slate-800">
      {title && <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={4}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {chartData.map((entry) => (
              <Cell key={entry.name} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              border: 'none',
              borderRadius: '12px',
            }}
            formatter={(value) => [`${value} kg CO₂`, 'Emissions']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart;
