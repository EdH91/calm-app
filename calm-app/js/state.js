// Local, single-profile data store for Alex's calm-down app.
// Everything lives in localStorage on this device only -- never shared
// with MintIQ or any other Discendia Labs app's data.

const STORAGE_KEY = 'calmapp.v1';
const POINTS_PER_USE = 10;
const EARN_COOLDOWN_MS = 60 * 60 * 1000; // soft per-tool cap: 1 hour

const DEFAULT_REWARDS = [
  { id: 'story', name: "Pick tonight's bedtime story", cost: 20 },
  { id: 'dinner', name: "Choose Friday's dinner", cost: 40 },
  { id: 'screentime', name: '15 extra minutes of screen time', cost: 60 },
  { id: 'gamenight', name: 'Family game night pick', cost: 100 }
];

function defaultState() {
  return {
    points: 0,
    log: [],       // { toolId, ts, pointsAwarded }
    redemptions: [], // { rewardId, ts, cost }
    rewards: DEFAULT_REWARDS
  };
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    return { ...defaultState(), ...parsed };
  } catch (e) {
    return defaultState();
  }
}

let state = load();
const listeners = new Set();

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // storage full or unavailable -- fail quietly, in-memory state still works
  }
  listeners.forEach((fn) => fn(state));
}

export const store = {
  getState() {
    return state;
  },

  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },

  /**
   * Record that a tool was used and award points, unless that tool
   * already paid out within the cooldown window. Usage is always
   * logged (so Parent view reflects real activity) even when the
   * cooldown blocks a second payout -- trying the tool again should
   * never feel like it "didn't count" to the child.
   */
  recordToolUse(toolId) {
    const now = Date.now();
    const recentSameTool = state.log
      .filter((e) => e.toolId === toolId)
      .sort((a, b) => b.ts - a.ts)[0];

    const onCooldown = recentSameTool && now - recentSameTool.ts < EARN_COOLDOWN_MS;
    const pointsAwarded = onCooldown ? 0 : POINTS_PER_USE;

    state = {
      ...state,
      points: state.points + pointsAwarded,
      log: [...state.log, { toolId, ts: now, pointsAwarded }]
    };
    persist();
    return pointsAwarded;
  },

  canRedeem(rewardId) {
    const reward = state.rewards.find((r) => r.id === rewardId);
    return !!reward && state.points >= reward.cost;
  },

  redeemReward(rewardId) {
    const reward = state.rewards.find((r) => r.id === rewardId);
    if (!reward || state.points < reward.cost) return false;
    state = {
      ...state,
      points: state.points - reward.cost,
      redemptions: [...state.redemptions, { rewardId, ts: Date.now(), cost: reward.cost }]
    };
    persist();
    return true;
  },

  addReward(name, cost) {
    const id = 'r_' + Date.now();
    state = { ...state, rewards: [...state.rewards, { id, name, cost }] };
    persist();
    return id;
  },

  updateReward(rewardId, fields) {
    state = {
      ...state,
      rewards: state.rewards.map((r) => (r.id === rewardId ? { ...r, ...fields } : r))
    };
    persist();
  },

  removeReward(rewardId) {
    state = { ...state, rewards: state.rewards.filter((r) => r.id !== rewardId) };
    persist();
  },

  recentLog(limit = 10) {
    return [...state.log].sort((a, b) => b.ts - a.ts).slice(0, limit);
  },

  weekStats() {
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const thisWeek = state.log.filter((e) => e.ts >= weekAgo);
    const counts = {};
    thisWeek.forEach((e) => {
      counts[e.toolId] = (counts[e.toolId] || 0) + 1;
    });
    let mostUsed = null;
    let mostUsedCount = 0;
    Object.entries(counts).forEach(([toolId, count]) => {
      if (count > mostUsedCount) {
        mostUsed = toolId;
        mostUsedCount = count;
      }
    });

    // day streak: consecutive days (including today) with at least one use
    const daySet = new Set(state.log.map((e) => new Date(e.ts).toDateString()));
    let streak = 0;
    const cursor = new Date();
    while (daySet.has(cursor.toDateString())) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    return { checkIns: thisWeek.length, mostUsed, streak };
  }
};
