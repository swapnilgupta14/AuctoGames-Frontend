import { useEffect, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

export default function PWAPrompt() {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  
  const {
    updateServiceWorker,
    needRefresh: [pwaNeedRefresh, setNeedRefreshState],
    offlineReady: [pwaOfflineReady, setOfflineReadyState],
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log('SW Registered: ' + r.scope);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    }
  });

  useEffect(() => {
    setOfflineReady(pwaOfflineReady);
    setNeedRefresh(pwaNeedRefresh);
  }, [pwaOfflineReady, pwaNeedRefresh]);

  const close = () => {
    setOfflineReadyState(false);
    setNeedRefreshState(false);
  };

  const refresh = () => {
    updateServiceWorker(true);
  };

  if (!offlineReady && !needRefresh) return null;

  return (
    <div className="fixed bottom-0 right-0 m-4 p-4 bg-white rounded-lg shadow-lg z-50">
      <div className="flex flex-col items-start">
        {offlineReady && (
          <div className="mb-2">
            App ready to work offline
            <button
              className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
              onClick={close}
            >
              Close
            </button>
          </div>
        )}
        {needRefresh && (
          <div className="mb-2">
            New content available, click to reload
            <button
              className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
              onClick={refresh}
            >
              Reload
            </button>
          </div>
        )}
      </div>
    </div>
  );
}