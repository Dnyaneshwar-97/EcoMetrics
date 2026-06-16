import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../../hooks/useTheme';

const ReductionAreaChart = ({ data, dataKey = 'reduction', color = '#059669', title, exportId }) => {
  const { isDark } = useTheme();
  const gridColor = isDark ? '#334155' : '#e2e8f0';
  const textColor = isDark ? '#94a3b8' : '#64748b';

  return (
    <div id={exportId} className="glass-card p-6">
      {title && <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="reductionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="label" stroke={textColor} fontSize={12} />
          <YAxis stroke={textColor} fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              border: 'none',
              borderRadius: '12px',
            }}
          />
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            fill="url(#reductionGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReductionAreaChart;
