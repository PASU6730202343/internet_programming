import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';

import { CHART } from './chart-tokens';

type ElbowPoint = { k: number; inertia: number };

type Props = {
  data: ElbowPoint[];
  selectedK: number;
  width: number;
  height?: number;
};

const MARGIN = { top: 20, right: 20, bottom: 36, left: 64 };

function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return Math.round(n).toString();
}

function niceMax(value: number): number {
  if (value <= 0) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const normalized = value / magnitude;
  const step = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return step * magnitude;
}

export function ElbowChart({ data, selectedK, width, height = 260 }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(
    data.findIndex((d) => d.k === selectedK)
  );

  if (data.length === 0) return null;

  const plotWidth = Math.max(width - MARGIN.left - MARGIN.right, 10);
  const plotHeight = height - MARGIN.top - MARGIN.bottom;

  const maxK = data[data.length - 1].k;
  const minK = data[0].k;
  const maxInertia = niceMax(Math.max(...data.map((d) => d.inertia)));

  const xFor = (k: number) =>
    MARGIN.left + ((k - minK) / Math.max(maxK - minK, 1)) * plotWidth;
  const yFor = (inertia: number) =>
    MARGIN.top + plotHeight - (inertia / maxInertia) * plotHeight;

  const pathD = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${xFor(d.k)} ${yFor(d.inertia)}`)
    .join(' ');

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * maxInertia);
  const active = activeIndex !== null ? data[activeIndex] : null;
  const selectedPoint = data.find((d) => d.k === selectedK);

  return (
    <View>
      <Svg width={width} height={height}>
        {/* gridlines */}
        {yTicks.map((tick, i) => (
          <Line
            key={i}
            x1={MARGIN.left}
            x2={width - MARGIN.right}
            y1={yFor(tick)}
            y2={yFor(tick)}
            stroke={CHART.gridline}
            strokeWidth={1}
          />
        ))}
        {/* axis */}
        <Line
          x1={MARGIN.left}
          x2={MARGIN.left}
          y1={MARGIN.top}
          y2={height - MARGIN.bottom}
          stroke={CHART.axis}
          strokeWidth={1}
        />
        <Line
          x1={MARGIN.left}
          x2={width - MARGIN.right}
          y1={height - MARGIN.bottom}
          y2={height - MARGIN.bottom}
          stroke={CHART.axis}
          strokeWidth={1}
        />

        {/* guide line down to the chosen k */}
        {selectedPoint && (
          <Line
            x1={xFor(selectedPoint.k)}
            x2={xFor(selectedPoint.k)}
            y1={yFor(selectedPoint.inertia)}
            y2={height - MARGIN.bottom}
            stroke={CHART.axis}
            strokeWidth={1}
          />
        )}

        {/* line */}
        <Path d={pathD} stroke="#2a78d6" strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />

        {/* point rings (surface-color halo so points stay legible on the line) */}
        {data.map((d) => {
          const isSelected = d.k === selectedK;
          const r = isSelected ? 6 : 4;
          return (
            <Circle key={`ring-${d.k}`} cx={xFor(d.k)} cy={yFor(d.inertia)} r={r + 2} fill={CHART.surface} />
          );
        })}
        {data.map((d) => {
          const isSelected = d.k === selectedK;
          const r = isSelected ? 6 : 4;
          return (
            <Circle key={`fill-${d.k}`} cx={xFor(d.k)} cy={yFor(d.inertia)} r={r} fill="#2a78d6" />
          );
        })}

        {/* chosen-k direct label */}
        {selectedPoint && (
          <SvgText
            x={xFor(selectedPoint.k)}
            y={yFor(selectedPoint.inertia) - 14}
            fontSize={11}
            fontWeight="700"
            fill={CHART.textPrimary}
            textAnchor="middle"
          >
            k={selectedK}
          </SvgText>
        )}

        {/* x tick labels */}
        {data.map((d) => (
          <SvgText
            key={`x-${d.k}`}
            x={xFor(d.k)}
            y={height - MARGIN.bottom + 18}
            fontSize={11}
            fill={CHART.muted}
            textAnchor="middle"
          >
            {d.k}
          </SvgText>
        ))}
        {/* y tick labels */}
        {yTicks.map((tick, i) => (
          <SvgText
            key={`y-${i}`}
            x={MARGIN.left - 10}
            y={yFor(tick) + 4}
            fontSize={11}
            fill={CHART.muted}
            textAnchor="end"
          >
            {formatCompact(tick)}
          </SvgText>
        ))}
      </Svg>

      {/* transparent hit targets (generous, >=24px) laid over the SVG points */}
      <View style={{ position: 'absolute', left: 0, top: 0, width, height }} pointerEvents="box-none">
        {data.map((d, i) => (
          <Pressable
            key={d.k}
            onPress={() => setActiveIndex(i)}
            hitSlop={8}
            style={{
              position: 'absolute',
              left: xFor(d.k) - 14,
              top: yFor(d.inertia) - 14,
              width: 28,
              height: 28,
              borderRadius: 14,
            }}
          />
        ))}
      </View>

      <View style={{ marginTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 12, color: CHART.textSecondary }}>
          จำนวนกลุ่ม (k) แกน X · Inertia แกน Y
        </Text>
        {active && (
          <Text style={{ fontSize: 13, fontWeight: '700', color: CHART.textPrimary }}>
            k={active.k} · inertia {formatCompact(active.inertia)}
          </Text>
        )}
      </View>
    </View>
  );
}

export default ElbowChart;
