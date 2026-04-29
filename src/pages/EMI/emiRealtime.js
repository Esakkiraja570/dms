const CACHE_PREFIX = "emi_customers_cache";
const ACTIVITY_KEY = "emi_activity_feed";
const UPDATE_KEY = "emi_last_update";

const safeJsonParse = (value, fallback) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
};

export const getCustomerCacheKey = (agentId) => `${CACHE_PREFIX}_${agentId}`;

export const getCachedCustomers = (agentId) => {
  if (!agentId) return [];
  return safeJsonParse(localStorage.getItem(getCustomerCacheKey(agentId)), []);
};

export const setCachedCustomers = (agentId, customers) => {
  if (!agentId) return;
  localStorage.setItem(getCustomerCacheKey(agentId), JSON.stringify(customers || []));
};

export const getActivityFeed = () => safeJsonParse(localStorage.getItem(ACTIVITY_KEY), []);

export const pushActivity = (entry) => {
  const current = getActivityFeed();
  const next = [
    {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      timestamp: new Date().toISOString(),
      ...entry
    },
    ...current
  ].slice(0, 8);

  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(next));
};

export const publishEmiUpdate = (payload = {}) => {
  const detail = {
    timestamp: Date.now(),
    ...payload
  };

  localStorage.setItem(UPDATE_KEY, JSON.stringify(detail));
  window.dispatchEvent(new CustomEvent("emi:updated", { detail }));
};

export const readPublishedEmiUpdate = () =>
  safeJsonParse(localStorage.getItem(UPDATE_KEY), null);
