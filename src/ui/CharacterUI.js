import { Overlay } from './Overlay.js';
import { COLORS } from '../utils/Constants.js';
import { ITEMS } from '../data/items.js';
import { SKILLS, SKILL_TREE_KEYS, skillTree, allocateSkill, XP_PER_LEVEL, BASE_STATS } from '../data/skills.js';
export class CharacterUI {
  constructor() {
    this.overlay = new Overlay();
  }
  open(game) {
    const box = this.overlay.create(game.canvas);
    this.game = game;
    this.box = box;
    this.render();
    this.overlay.open();
    this.attachEvents();
  }
  close(game) {
    this.overlay.close();
    this.box.innerHTML = '';
  }
  render() {
    const p = this.game.player;
    const stats = this.game.systems.progression.effective();
    const equip = p.equipment || {};
    const xpTo = XP_PER_LEVEL(p.level || 1);
    const rows = [];
    rows.push(`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
      <span style="font-weight:bold;color:${COLORS.ember};font-size:15px">Character</span>
      <span style="color:${COLORS.gold}">Gold ${p.gold}</span>
    </div>`);
    rows.push(`<table style="width:100%;border-collapse:collapse;color:${COLORS.bone};font-size:12px">
      <tr><td style="padding:2px 6px">Level</td><td style="text-align:right">${p.level}</td></tr>
      <tr><td style="padding:2px 6px">XP</td><td style="text-align:right">${p.xp} / ${xpTo}</td></tr>
      <tr><td style="padding:2px 6px">Stat points</td><td style="text-align:right">${p.statPoints || 0}</td></tr>
      <tr><td style="padding:2px 6px">Skill points</td><td style="text-align:right">${p.skillPoints || 0}</td></tr>
    </table>`);
    rows.push(`<hr style="border-color:${COLORS.border};margin:8px 0">`);
    rows.push(`<div style="color:${COLORS.bone};font-weight:bold;margin-bottom:4px">Attributes</div>`);
    rows.push(`<table style="width:100%;border-collapse:collapse;font-size:12px">
      <tr><td style="padding:2px 6px">Strength</td><td style="text-align:right;color:${COLORS.ember}">${stats.strength || 0}</td></tr>
      <tr><td style="padding:2px 6px">Agility</td><td style="text-align:right;color:${COLORS.ember}">${stats.agility || 0}</td></tr>
      <tr><td style="padding:2px 6px">Defense</td><td style="text-align:right;color:${COLORS.ember}">${stats.defense || 0}</td></tr>
      <tr><td style="padding:2px 6px">Intelligence</td><td style="text-align:right;color:${COLORS.ember}">${stats.intelligence || 0}</td></tr>
      <tr><td style="padding:2px 6px">Crit chance</td><td style="text-align:right;color:${COLORS.ember}">${((stats.critical || 0.05) * 100).toFixed(1)}%</td></tr>
    </table>`);
    rows.push(`<hr style="border-color:${COLORS.border};margin:8px 0">`);
    rows.push(`<div style="color:${COLORS.bone};font-weight:bold;margin-bottom:4px">Health / Stamina / Mana</div>`);
    rows.push(`<table style="width:100%;border-collapse:collapse;font-size:12px">
      <tr><td style="padding:2px 6px">HP</td><td style="text-align:right;color:${COLORS.danger}">${p.hp} / ${p.maxHp}</td></tr>
      <tr><td style="padding:2px 6px">Stamina</td><td style="text-align:right;color:${COLORS.heal}">${p.stamina || 60} / ${p.maxStamina || 60}</td></tr>
      <tr><td style="padding:2px 6px">Mana</td><td style="text-align:right;color:${COLORS.mana}">${p.mana || 30} / ${p.maxMana || 30}</td></tr>
    </table>`);
    rows.push(`<hr style="border-color:${COLORS.border};margin:8px 0">`);
    rows.push(this._equipmentSection(equip));
    rows.push(`<hr style="border-color:${COLORS.border};margin:8px 0">`);
    rows.push(this._skillsSection());
    rows.push(`<hr style="border-color:${COLORS.border};margin:8px 0">`);
    rows.push(`<button data-action="close" style="margin-top:6px">Close (Esc)</button>`);
    this.overlay.show(rows.join('\n'));
  }
  _equipmentSection(equip) {
    const slots = [
      { key: 'head', label: 'Head' },
      { key: 'chest', label: 'Chest' },
      { key: 'hands', label: 'Hands' },
      { key: 'legs', label: 'Legs' },
      { key: 'feet', label: 'Feet' },
      { key: 'main', label: 'Main Hand' },
      { key: 'off', label: 'Off Hand' },
      { key: 'amulet', label: 'Amulet' },
      { key: 'ring', label: 'Ring' },
    ];
    let html = `<div style="color:${COLORS.bone};font-weight:bold;margin-bottom:4px">Equipment</div>`;
    for (const s of slots) {
      const id = equip[s.key];
      const def = id ? ITEMS[id] : null;
      const name = def ? def.name : 'Empty';
      const rar = def ? def.rarity : '';
      const rarColor = def ? rarityColor(def.rarity) : '';
      html += `<div style="padding:2px 0;font-size:12px;display:flex;justify-content:space-between">
        <span><span style="color:${COLORS.textDim}">${s.label}:</span> ${name}${rar ? ' <span style="color:'+rarColor+';font-size:10px">'+rar+'</span>' : ''}</span>
        ${def ? `<button data-action="unequip" data-slot="${s.key}" style="color:${COLORS.ember};font-size:11px">Un equip</button>` : ''}
      </div>`;
    }
    return html;
  }
  _skillsSection() {
    const p = this.game.player;
    let html = `<div style="color:${COLORS.bone};font-weight:bold;margin-bottom:4px">Skills</div>`;
    html += `<div style="color:${COLORS.textDim};font-size:11px;margin-bottom:6px">Points available: ${p.skillPoints || 0}</div>`;
    for (const treeId of SKILL_TREE_KEYS) {
      const tree = skillTree(treeId);
      if (!tree) continue;
      const progress = p.skillTreeProgress && p.skillTreeProgress[treeId] || {};
      html += `<div style="margin:6px 0 2px;border-left:2px solid ${COLORS.ember};padding-left:8px">`;
      html += `<div style="color:${COLORS.ember};font-weight:bold;font-size:12px">${tree.name}</div>`;
      html += `<div style="color:${COLORS.textDim};font-size:10px;margin-bottom:4px">${tree.desc}</div>`;
      for (const b of tree.branches) {
        const lvl = progress[b.id] || 0;
        const maxed = lvl >= b.max;
        html += `<div style="display:flex;justify-content:space-between;align-items:center;font-size:11px;padding:2px 0">
          <span>
            <span style="color:${COLORS.bone}">${b.name}</span>
            <span style="color:${COLORS.textDim};font-size:10px">${b.desc}</span>
            <span style="color:${maxed ? COLORS.heal : COLORS.ember}">[${lvl}/${b.max}]</span>
          </span>
          ${!maxed && (p.skillPoints || 0) >= b.cost
            ? `<button data-action="skill" data-tree="${treeId}" data-skill="${b.id}" style="color:${COLORS.ember};font-size:10px">Invest ${b.cost}</button>`
            : `<span style="color:${COLORS.textDim};font-size:10px">${maxed ? 'MAX' : 'need ' + b.cost}</span>`
          }
        </div>`;
      }
      html += `</div>`;
    }
    return html;
  }
  attachEvents() {
    const box = this.box;
    const game = this.game;
    box.addEventListener('click', (e) => {
      const a = e.target.dataset.action;
      if (a === 'close') {
        this.close(game);
        game.closeOverlay();
        return;
      }
      if (a === 'unequip' && e.target.dataset.slot) {
        const slot = e.target.dataset.slot;
        const id = game.player.equipment?.[slot];
        if (id) {
          const inv = game.player.inventory || {};
          inv[id] = (inv[id] || 0) + 1;
          game.player.inventory = inv;
          game.player.equipment[slot] = null;
          if (slot === 'main') game.player.weapon = null;
          game.player.weaponName = game.player.weapon ? (ITEMS[game.player.weapon]?.name || 'Fists') : 'Fists';
          game.player.invDirty = true;
          this.render();
          game.audio?.play('equip');
        }
        return;
      }
      if (a === 'skill' && e.target.dataset.tree && e.target.dataset.skill) {
        const ok = allocateSkill(game.player, e.target.dataset.tree, e.target.dataset.skill);
        if (ok) {
          game.audio?.play('equip');
          this.render();
        }
        return;
      }
    });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        this.close(game);
        game.closeOverlay();
      }
    });
    setTimeout(() => {
      const b = box.querySelector('button[data-action="close"]');
      if (b) b.focus();
    }, 0);
  }
}
function rarityColor(r) {
  return {
    common: COLORS.common,
    uncommon: COLORS.uncommon,
    rare: COLORS.rare,
    epic: COLORS.epic,
    legendary: COLORS.legendary,
  }[r] || COLORS.textDim;
}
