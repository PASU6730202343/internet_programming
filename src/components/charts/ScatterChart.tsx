import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';

import { CHART, CLUSTER_COLORS, CLUSTER_LABEL_TH } from './chart-tokens';

export type ScatterPoint = {
  id: string | number;
  x: number; // price
  y: number; // stock quantity
  label: string; // item name
  cluster: string; // cluster_label
};

type Props = {
  points: ScatterPoint[];
  width: number;
  height?: number;
};

const MARGIN = { top: 20, right: 20, bottom: 44, left: 64 };
const CLUSTER_ORDER = ['budget', 'mid-range', 'premium'];

function niceMax(value: number): number {
  if (value <= 0) return 1;
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
  const normalized = value / magnitude;
  const step = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return step * magnitude;
}

export function ScatterChart({ points, width, height = 320 }: Props) {
  const [activeId, setActiveId] = useState<string | number | null>(null);

  if (points.length === 0) return null;

  const plotWidth = Math.max(width - MARGIN.left - MARGIN.right, 10);
  const plotHeight = height - MARGIN.top - MARGIN.bottom;

  const maxX = niceMax(Math.max(...points.map((p) => p.x)));
  const maxY = niceMax(Math.max(...points.map((p) => p.y), 1));

  const xFor = (x: number) => MARGIN.left + (x / maxX) * plotWidth;
  const yFor = (y: number) => MARGIN.top + plotHeight - (y / maxY) * plotHeight;

  const xTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * maxX);
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => t * maxY);

  const active = points.find((p) => p.id === activeId) || null;

  return (
    <View>
      <Svg width={width} height={height}>
        {/* gridlines */}
        {yTicks.map((tick, i) => (
          <Line key={`gy-${i}`} x1={MARGIN.left} x2={width - MARGIN.right} y1={yFor(tick)} y2={yFor(tick)} stroke={CHART.gridline} strokeWidth={1} />
        ))}
        {xTicks.map((tick, i) => (
          <Line key={`gx-${i}`} x1={xFor(tick)} x2={xFor(tick)} y1={MARGIN.top} y2={height - MARGIN.bottom} stroke={CHART.gridline} strokeWidth={1} />
        ))}

        {/* axes */}
        <Line x1={MARGIN.left} x2={MARGIN.left} y1={MARGIN.top} y2={height - MARGIN.bottom} stroke={CHART.axis} strokeWidth={1} />
        <Line x1={MARGIN.left} x2={width - MARGIN.right} y1={height - MARGIN.bottom} y2={height - MARGIN.bottom} stroke={CHART.axis} strokeWidth={1} />

        {/* points: surface ring then fill, so overlapping dots stay legible */}
        {points.map((p) => (
          <Circle key={`ring-${p.id}`} cx={xFor(p.x)} cy={yFor(p.y)} r={p.id === activeId ? 8 : 6} fill={CHART.surface} />
        ))}
        {points.map((p) => (
          <Circle
            key={`dot-${p.id}`}
            cx={xFor(p.x)}
            cy={yFor(p.y)}
            r={p.id === activeId ? 6 : 4}
            fill={CLUSTER_COLORS[p.cluster] || CHART.muted}
          />
        ))}

        {/* tick labels */}
        {xTicks.map((tick, i) => (
          <SvgText key={`xl-${i}`} x={xFor(tick)} y={height - MARGIN.bottom + 18} fontSize={11} fill={CHART.muted} textAnchor="middle">
            {Math.round(tick).toLocaleString()}
          </SvgText>
        ))}
        {yTicks.map((tick, i) => (
          <SvgText key={`yl-${i}`} x={MARGIN.left - 10} y={yFor(tick) + 4} fontSize={11} fill={CHART.muted} textAnchor="end">
            {Math.round(tick).toLocaleString()}
          </SvgText>
        ))}

        {/* axis titles */}
        <SvgText x={MARGIN.left + plotWidth / 2} y={height - 6} fontSize={12} fill={CHART.textSecondary} textAnchor="middle">
          ราคา (บาท)
        </SvgText>
        <SvgText
          x={16}
          y={MARGIN.top + plotHeight / 2}
          fontSize={12}
          fill={CHART.textSecondary}
          textAnchor="middle"
          transform={`rotate(-90, 16, ${MARGIN.top + plotHeight / 2})`}
        >
          จำนวนสต็อก (ชิ้น)
        </SvgText>
      </Svg>

      {/* transparent hit targets, generous enough for touch (>=24px) */}
      <View style={{ position: 'absolute', left: 0, top: 0, width, height }} pointerEvents="box-none">
        {points.map((p) => (
          <Pressable
            key={`hit-${p.id}`}
            onPress={() => setActiveId(p.id)}
            hitSlop={6}
            style={{
              position: 'absolute',
              left: xFor(p.x) - 14,
              top: yFor(p.y) - 14,
              width: 28,
              height: 28,
              borderRadius: 14,
            }}
          />
        ))}
      </View>

      {/* legend — always present for >= 2 series */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, marginTop: 12 }}>
        {CLUSTER_ORDER.map((label) => (
          <View key={label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: CLUSTER_COLORS[label] }} />
            <Text style={{ fontSize: 12, color: CHART.textSecondary }}>{CLUSTER_LABEL_TH[label]}</Text>
          </View>
        ))}
      </View>

      {/* selected-point detail — every value a tooltip would show is also here, reachable without hover */}
      <View
        style={{
          marginTop: 10,
          padding: 12,
          borderRadius: 6,
          backgroundColor: CHART.pagePlane,
          borderWidth: 1,
          borderColor: CHART.border,
          minHeight: 44,
        }}
      >
        {active ? (
          <>
            <Text style={{ fontSize: 13, fontWeight: '700', color: CHART.textPrimary }}>{active.label}</Text>
            <Text style={{ fontSize: 12, color: CHART.textSecondary, marginTop: 2 }}>
              ราคา {active.x.toLocaleString()} บาท · สต็อก {active.y.toLocaleString()} ชิ้น ·{' '}
              <Text style={{ color: CLUSTER_COLORS[active.cluster], fontWeight: '700' }}>
                {CLUSTER_LABEL_TH[active.cluster] || active.cluster}
              </Text>
            </Text>
          </>
        ) : (
          <Text style={{ fontSize: 12, color: CHART.muted }}>แตะจุดในกราฟเพื่อดูรายละเอียดสินค้า</Text>
        )}
      </View>
    </View>
  );
}

export default ScatterChart;
