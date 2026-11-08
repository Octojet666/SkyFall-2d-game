import { questDef, startQuest as qsStart, advanceQuest, completeQuest, claimQuest, activeQuestIds, questProgress } from '../data/quests.js';
import { playQuest } from '../data/audio.js';
export class QuestSystem {
  constructor(state) {
    this.state = state;
  }
  start(id) {
    if (!questDef(id)) return false;
    if (this.state.quests[id] && this.state.quests[id].completed) return false;
    qsStart(this.state, id);
    playQuest();
    this.state.dirty = true;
    return true;
  }
  advance(id, stage) {
    if (!questDef(id)) return false;
    advanceQuest(this.state, id, stage);
    this.state.dirty = true;
    return true;
  }
  complete(id) {
    if (!questDef(id)) return null;
    const rewards = completeQuest(this.state, id);
    if (!rewards) return null;
    this.state.dirty = true;
    return rewards;
  }
  claim(id) {
    if (!questDef(id)) return null;
    // The final "report back" stage has no criteria of its own: talking to the
    // quest giver is what satisfies it.
    const q = this.state.quests[id];
    if (q && q.stages && q.stages.length) {
      const last = q.stages[q.stages.length - 1];
      const hasCriteria = last.kind || last.item || last.region || last.npc || last.boss;
      if (!last.done && !hasCriteria) last.done = true;
    }
    // Turn in automatically if every stage is finished.
    if (!this.state.quests[id]?.completed) this.complete(id);
    const rewards = claimQuest(this.state, id);
    if (!rewards) return null;
    this.state.dirty = true;
    if (rewards.gold) this.state.gold = (this.state.gold || 0) + rewards.gold;
    if (rewards.xp) {
      if (this.progression) this.progression.addXp(rewards.xp);
      else this.state.xp = (this.state.xp || 0) + rewards.xp;
    }
    if (rewards.item) {
      const inv = this.state.inventory || {};
      inv[rewards.item] = (inv[rewards.item] || 0) + 1;
      this.state.inventory = inv;
    }
    playQuest();
    return rewards;
  }
  progress(id) {
    return questProgress(this.state, id);
  }
  activeIds() {
    return activeQuestIds(this.state);
  }
  allIds() {
    return Object.keys(this.state.quests);
  }
  activeList() {
    return this.activeIds().map((id) => questDef(id)).filter(Boolean);
  }
  allList() {
    return Object.keys(this.state.quests).map((id) => questDef(id)).filter(Boolean);
  }
  has(id) {
    return !!this.state.quests[id];
  }
  isCompleted(id) {
    const q = this.state.quests[id];
    return !!(q && q.completed);
  }
  isClaimed(id) {
    const q = this.state.quests[id];
    return !!(q && q.claimed);
  }
  stageDone(id, stage) {
    const q = this.state.quests[id];
    if (!q) return false;
    if (stage < 0 || stage >= q.stages.length) return false;
    return !!q.stages[stage]?.done;
  }
  currentStage(id) {
    const p = this.progress(id);
    if (!p) return -1;
    return p.currentStage;
  }
  meetNpc(id) {
    if (!this.state.metNpcs) this.state.metNpcs = new Set();
    this.state.metNpcs.add(id);
    this.state.dirty = true;
  }
  visitRegion(id) {
    if (!this.state.visitedRegions) this.state.visitedRegions = new Set();
    this.state.visitedRegions.add(id);
    this.state.dirty = true;
  }
  /** Kills only count toward the stage the quest is actually on. */
  noteKill(kind) {
    if (!kind) return;
    for (const id of Object.keys(this.state.quests)) {
      const p = this.progress(id);
      if (!p || p.currentStage < 0 || p.completed) continue;
      const q = this.state.quests[id];
      const stage = q && q.stages[p.currentStage];
      if (stage && stage.kind === kind && !stage.done) {
        advanceQuest(this.state, id, p.currentStage);
        this.state.dirty = true;
        if (stage.done) playQuest();
      }
    }
  }
  incrementKill(kind) {
    if (!this.state.killsByKind) this.state.killsByKind = {};
    this.state.killsByKind[kind] = (this.state.killsByKind[kind] || 0) + 1;
    this.state.dirty = true;
  }
  incrementItem(itemId) {
    if (!this.state.items) this.state.items = {};
    this.state.items[itemId] = (this.state.items[itemId] || 0) + 1;
    this.state.dirty = true;
  }
  clearAll() {
    this.state.quests = {};
    this.state.dirty = true;
  }
  dirty() {
    return this.state.dirty || false;
  }
  markClean() {
    this.state.dirty = false;
  }
}
