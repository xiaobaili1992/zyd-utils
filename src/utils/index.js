const getPerformanceMetrics = () => {
  return new Promise((resolve) => {
    let metrics = {
      fp: 'N/A',
      fcp: 'N/A',
      lcp: 'N/A',
      ttfb: 'N/A',
    };

    // 获取 FP 和 FCP
    window.addEventListener('load', () => {
      const paintEntries = performance.getEntriesByType('paint');
      console.error('=====> paintEntries', paintEntries);
      const fp = paintEntries.find((entry) => entry.name === 'first-paint');
      const fcp = paintEntries.find((entry) => entry.name === 'first-contentful-paint');

      metrics.fp = fp ? fp.startTime : 'N/A';
      metrics.fcp = fcp ? fcp.startTime : 'N/A';

      // 获取 TTFB
      const [navigationEntry] = performance.getEntriesByType('navigation');
      const ttfb = navigationEntry.responseStart - navigationEntry.startTime;
      metrics.ttfb = ttfb;

      // 获取 LCP
      let lcp;
      const observer = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        lcp = entries[entries.length - 1];
        console.error('=====> lcp， entries', lcp, entries);
        metrics.lcp = lcp ? lcp.startTime : 'N/A';
      });

      observer.observe({ type: 'largest-contentful-paint', buffered: true });

      // 在页面加载完毕后再返回性能数据
      observer.disconnect();
      resolve(metrics);
    });
  });
};

export { getPerformanceMetrics };
