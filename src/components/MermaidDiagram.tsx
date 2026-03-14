import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: true,
  theme: 'dark',
  securityLevel: 'loose',
  fontFamily: 'Inter',
  flowchart: {
    htmlLabels: true,
    curve: 'basis'
  }
});

interface Props {
  chart: string;
}

export default function MermaidDiagram({ chart }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && chart) {
      ref.current.removeAttribute('data-processed');
      mermaid.contentLoaded();
      
      // Force a re-render by clearing and setting content
      const renderChart = async () => {
        try {
          const { svg } = await mermaid.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, chart);
          if (ref.current) {
            ref.current.innerHTML = svg;
          }
        } catch (err) {
          console.error("Mermaid render error:", err);
        }
      };
      
      renderChart();
    }
  }, [chart]);

  return (
    <div className="w-full flex justify-center bg-black/20 p-8 rounded-3xl border border-white/5 overflow-x-auto min-h-[400px]">
      <div ref={ref} className="mermaid" />
    </div>
  );
}
