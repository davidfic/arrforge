import { useMemo } from 'react';
import type { WizardState, AppCategory } from '../types';
import { CATEGORY_ORDER } from '../types';
import { getAppsByCategoryWithCustom } from '../utils/appLookup';
import { getActiveConnections, type ConnectionType } from '../data/connections';

interface ArchitectureDiagramProps {
  state: WizardState;
}

const CONNECTION_COLORS: Record<ConnectionType, string> = {
  'download-client': '#f97316',
  'indexer': '#3b82f6',
  'subtitle': '#22c55e',
  'media-server': '#a855f7',
  'request': '#06b6d4',
  'monitoring': '#6b7280',
  'quality-profile': '#eab308',
};

const HOST_COLORS = [
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#10b981', // emerald
];

const NODE_W = 130;
const NODE_H = 36;
const COL_GAP = 180;
const ROW_GAP = 52;
const PAD_X = 40;
const PAD_Y = 60;
const HOST_PAD = 16;
const HOST_LABEL_H = 22;

interface NodePos {
  id: string;
  name: string;
  x: number;
  y: number;
  category: AppCategory;
}

export function ArchitectureDiagram({ state }: ArchitectureDiagramProps) {
  const connections = getActiveConnections(state.selectedApps);
  const isMultiHost = state.multiHost && state.hosts.length > 1;

  const { nodes, width, height, hostGroups } = useMemo(() => {
    const selectedSet = new Set(state.selectedApps);
    const columns: { category: AppCategory; apps: { id: string; name: string }[] }[] = [];

    for (const cat of CATEGORY_ORDER) {
      const catApps = getAppsByCategoryWithCustom(cat, state.customApps).filter((a) => selectedSet.has(a.id));
      if (catApps.length > 0) {
        columns.push({ category: cat, apps: catApps.map((a) => ({ id: a.id, name: a.name })) });
      }
    }

    const nodeList: NodePos[] = [];
    let maxRows = 0;

    for (let col = 0; col < columns.length; col++) {
      const { category, apps } = columns[col];
      maxRows = Math.max(maxRows, apps.length);
      for (let row = 0; row < apps.length; row++) {
        nodeList.push({
          id: apps[row].id,
          name: apps[row].name,
          x: PAD_X + col * (NODE_W + COL_GAP),
          y: PAD_Y + row * (NODE_H + ROW_GAP),
          category,
        });
      }
    }

    const w = PAD_X * 2 + columns.length * NODE_W + (columns.length - 1) * COL_GAP;
    const h = PAD_Y * 2 + maxRows * NODE_H + (maxRows - 1) * ROW_GAP;

    // Build host groups for multi-host mode
    let groups: { hostId: string; hostName: string; colorIdx: number; minX: number; minY: number; maxX: number; maxY: number }[] = [];
    if (isMultiHost) {
      const nodeMap = new Map<string, NodePos>();
      for (const n of nodeList) nodeMap.set(n.id, n);

      for (let i = 0; i < state.hosts.length; i++) {
        const host = state.hosts[i];
        const hostApps = state.selectedApps.filter((appId) => {
          const assigned = state.hostAssignments[appId];
          return assigned === host.id || (!assigned && host.id === state.hosts[0]?.id);
        });

        const hostNodes = hostApps.map((id) => nodeMap.get(id)).filter(Boolean) as NodePos[];
        if (hostNodes.length === 0) continue;

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        for (const n of hostNodes) {
          minX = Math.min(minX, n.x);
          minY = Math.min(minY, n.y);
          maxX = Math.max(maxX, n.x + NODE_W);
          maxY = Math.max(maxY, n.y + NODE_H);
        }

        groups.push({
          hostId: host.id,
          hostName: host.name,
          colorIdx: i,
          minX: minX - HOST_PAD,
          minY: minY - HOST_PAD - HOST_LABEL_H,
          maxX: maxX + HOST_PAD,
          maxY: maxY + HOST_PAD,
        });
      }
    }

    return { nodes: nodeList, width: Math.max(w, 400), height: Math.max(h, 200), hostGroups: groups };
  }, [state.selectedApps, state.customApps, isMultiHost, state.hosts, state.hostAssignments]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, NodePos>();
    for (const n of nodes) map.set(n.id, n);
    return map;
  }, [nodes]);

  // Build a set of cross-host connections for styling
  const crossHostEdges = useMemo(() => {
    if (!isMultiHost) return new Set<string>();
    const set = new Set<string>();
    for (const conn of connections) {
      const fromHost = state.hostAssignments[conn.from] || state.hosts[0]?.id;
      const toHost = state.hostAssignments[conn.to] || state.hosts[0]?.id;
      if (fromHost !== toHost) {
        set.add(`${conn.from}->${conn.to}`);
      }
    }
    return set;
  }, [isMultiHost, connections, state.hostAssignments, state.hosts]);

  if (nodes.length < 2 || connections.length === 0) {
    return (
      <div className="mb-6 p-6 bg-theme-bg-surface border border-theme-border-subtle rounded-xl text-center">
        <p className="text-sm text-theme-text-muted">
          Select at least two connected apps to see the architecture diagram.
        </p>
      </div>
    );
  }

  // Deduplicate connections for rendering (keep one per from-to pair)
  const edgeKey = (from: string, to: string) => `${from}->${to}`;
  const seenEdges = new Set<string>();
  const uniqueConnections = connections.filter((c) => {
    const k = edgeKey(c.from, c.to);
    if (seenEdges.has(k)) return false;
    seenEdges.add(k);
    return true;
  });

  // Collect unique connection types used for legend
  const usedTypes = [...new Set(uniqueConnections.map((c) => c.type))];

  return (
    <div className="mb-6 bg-theme-bg-surface border border-theme-border-subtle rounded-xl overflow-hidden">
      <div className="p-3 border-b border-theme-border-subtle">
        <h3 className="text-sm font-medium text-theme-text-secondary">Architecture</h3>
      </div>
      <div className="overflow-x-auto scrollbar-hide p-4" style={{ minWidth: 0 }}>
        <svg
          width="100%"
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          className="block mx-auto"
          style={{ minWidth: `${Math.min(width, 400)}px` }}
        >
          <defs>
            {usedTypes.map((type) => (
              <marker
                key={type}
                id={`arrow-${type}`}
                markerWidth="8"
                markerHeight="6"
                refX="8"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill={CONNECTION_COLORS[type]} />
              </marker>
            ))}
          </defs>

          {/* Host grouping rectangles */}
          {hostGroups.map((group) => {
            const color = HOST_COLORS[group.colorIdx % HOST_COLORS.length];
            return (
              <g key={group.hostId}>
                <rect
                  x={group.minX}
                  y={group.minY}
                  width={group.maxX - group.minX}
                  height={group.maxY - group.minY}
                  rx={10}
                  fill="none"
                  stroke={color}
                  strokeWidth={1.5}
                  strokeDasharray="6 3"
                  strokeOpacity={0.6}
                />
                <text
                  x={group.minX + 8}
                  y={group.minY + 14}
                  fill={color}
                  fontSize={11}
                  fontWeight="600"
                  fontFamily="system-ui, sans-serif"
                >
                  {group.hostName}
                </text>
              </g>
            );
          })}

          {/* Edges */}
          {uniqueConnections.map((conn, i) => {
            const from = nodeMap.get(conn.from);
            const to = nodeMap.get(conn.to);
            if (!from || !to) return null;

            const x1 = from.x + NODE_W;
            const y1 = from.y + NODE_H / 2;
            const x2 = to.x;
            const y2 = to.y + NODE_H / 2;

            // If to is left of from, connect from left side
            const goingLeft = to.x < from.x;
            const sx = goingLeft ? from.x : x1;
            const ex = goingLeft ? to.x + NODE_W : x2;

            const dx = (ex - sx) * 0.4;
            const isCrossHost = crossHostEdges.has(`${conn.from}->${conn.to}`);

            return (
              <path
                key={i}
                d={`M ${sx} ${y1} C ${sx + dx} ${y1}, ${ex - dx} ${y2}, ${ex} ${y2}`}
                fill="none"
                stroke={CONNECTION_COLORS[conn.type]}
                strokeWidth={1.5}
                strokeOpacity={0.6}
                strokeDasharray={isCrossHost ? '5 3' : undefined}
                markerEnd={`url(#arrow-${conn.type})`}
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => (
            <g key={node.id}>
              <rect
                x={node.x}
                y={node.y}
                width={NODE_W}
                height={NODE_H}
                rx={8}
                fill="var(--color-bg-elevated)"
                stroke="var(--color-border)"
                strokeWidth={1}
              />
              <text
                x={node.x + NODE_W / 2}
                y={node.y + NODE_H / 2 + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--color-text-primary)"
                fontSize={11}
                fontFamily="system-ui, sans-serif"
              >
                {node.name}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="px-4 pb-3 flex flex-wrap gap-4 text-xs text-theme-text-muted">
        {usedTypes.map((type) => (
          <div key={type} className="flex items-center gap-1.5">
            <span
              className="w-3 h-0.5 rounded-full inline-block"
              style={{ backgroundColor: CONNECTION_COLORS[type] }}
            />
            {type.replace('-', ' ')}
          </div>
        ))}
        {isMultiHost && (
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-0.5 inline-block border-t border-dashed"
              style={{ borderColor: 'var(--color-text-muted)' }}
            />
            cross-host
          </div>
        )}
      </div>
    </div>
  );
}
