import { Overlay } from './Overlay.js';
import { COLORS } from '../utils/Constants.js';
import { QUEST_DEFS, questProgress } from '../data/quests.js';
export class QuestUI {
  constructor() {
    this.overlay = new Overlay();
  }
  open(game, questId) {
    const box = this.overlay.create(game.canvas);
    this.game = game;
    this.box = box;
    this.questId = questId;
    this.render();
    this.overlay.open();
    this.attachEvents();
  }
  close(game) {
    this.overlay.close();
    this.box.innerHTML = '';
  }
  render() {
    const g = this.game;
    const qs = g.systems.quest;
    const qid = this.questId || qs.activeIds()[0];
    const rows = [];
    if (!qid) {
      rows.push('<div style="color:' + COLORS.textDim + '">No active quests.</div>');
      rows.push('<hr style="border-color:' + COLORS.border + ';margin:10px 0">');
      rows.push(`<button data-action="close">Close (Esc)</button>`);
      this.overlay.show(rows.join('\n'));
      return;
    }
    const def = QUEST_DEFS[qid];
    if (!def) {
      rows.push('<div style="color:' + COLORS.textDim + '">Quest data missing.</div>');
      rows.push('<hr style="border-color:' + COLORS.border + ';margin:10px 0">');
      rows.push(`<button data-action="close">Close (Esc)</button>`);
      this.overlay.show(rows.join('\n'));
      return;
    }
    const prog = questProgress(g.player, qid);
    if (!prog) {
      rows.push('<div style="color:' + COLORS.textDim + '">Quest not started.</div>');
      rows.push('<hr style="border-color:' + COLORS.border + ';margin:10px 0">');
      rows.push(`<button data-action="close">Close (Esc)</button>`);
      this.overlay.show(rows.join('\n'));
      return;
    }
    const completed = prog.completed && !prog.claimed;
    rows.push(`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
      <span style="font-weight:bold;color:${COLORS.ember};font-size:15px">${def.name}</span>
      <span style="color:${completed?COLORS.heal:COLORS.textDim};font-size:11px">${completed?'Available to claim':'In progress'}</span>
    </div>`);
    rows.push(`<div style="color:${COLORS.textDim};font-size:11px;margin-bottom:6px">${def.summary}</div>`);
    for (let i = 0; i < prog.stages.length; i++) {
      const s = prog.stages[i];
      const done = !!s.done;
      const current = i === prog.currentStage && !done && !prog.completed;
      rows.push(`<div style="padding:3px 0;font-size:12px;display:flex;justify-content:space-between;align-items:center;border-left:3px solid ${done?COLORS.heal:current?COLORS.ember:COLORS.border};padding-left:8px">
        <span style="color:${done?COLORS.heal:current?COLORS.bone:COLORS.textDim}">${done?'✓':(current?'▸':'○')} ${s.name}</span>
        <span style="color:${COLORS.textDim};font-size:10px">${done?'done':(current?s.desc:'')}</span>
      </div>`);
    }
    if (completed) {
      rows.push(`<div style="margin-top:8px;padding:6px;background:rgba(80,160,100,0.12);border:1px solid ${COLORS.heal};color:${COLORS.heal}">Claim reward: ${def.rewards.gold||0}g, ${def.rewards.xp||0} XP${def.rewards.item?`, ${QUEST_DEFS[def.id]?.name||''}: ${def.rewards.item}`:''}</div>`);
      rows.push(`<button data-action="claim">Claim Reward</button>`);
    } else if (!prog.stages[0].done) {
      rows.push(`<button data-action="accept">Accept Quest</button>`);
    }
    rows.push(`<hr style="border-color:${COLORS.border};margin:10px 0">`);
    rows.push(`<button data-action="close">Close (Esc)</button>`);
    this.overlay.show(rows.join('\n'));
    if (completed) {
      const c = this.box.querySelector('button[data-action="claim"]');
      if (c) setTimeout(()=>c.focus(),0);
    }
  }
  attachEvents() {
    const box = this.box;
    const g = this.game;
    box.addEventListener('click', (e) => {
      const a = e.target.dataset.action;
      const qid = this.questId;
      if (a === 'close') {
        this.close(g);
        g.closeOverlay();
        return;
      }
      if (a === 'accept' && qid) {
        g.systems.quest.start(qid);
        g.hud.setMessage('Quest accepted: ' + (g.systems.quest.progress(qid)?.name || qid), 2);
        this.render();
        return;
      }
      if (a === 'claim' && qid) {
        const rewards = g.systems.quest.claim(qid);
        if (rewards) {
          g.hud.setMessage('Quest complete! +' + (rewards.gold||0) + 'g +' + (rewards.xp||0) + ' XP', 3);
          this.render();
        } else {
          g.hud.setMessage('Nothing to claim', 2);
        }
        return;
      }
    });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        this.close(g);
        g.closeOverlay();
      }
    });
    setTimeout(() => {
      const b = box.querySelector('button[data-action="close"]');
      if (b) b.focus();
    }, 0);
  }
}
