import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { CHART_COLORS } from '../../constants/ui';

const CategoryPieChart = ({ data, title, exportId }) => {
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const chartData = Object.entries(data ?? {}).map(([key, value]) => ({
    name: t(`categories.${key}`, { defaultValue: key }),
    value: Math.round(value * 10) / 10,
    color: CHART_COLORS[key] ?? '#10b981',
  }));

  return (
    <div id={exportId} className="glass-card p-6">
      {title && <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{title}</h3>}
      {chartData.length > 0 && (
        <div className="sr-only">
          <table>
            <caption>{title}</caption>
            <thead>
              <tr>
                <th scope="col">{t('calculator.yourDetails')}</th>
                <th scope="col">{t('common.co2')}</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ResponsiveContainer width="100%" height={300} aria-hidden={chartData.length > 0}>
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
