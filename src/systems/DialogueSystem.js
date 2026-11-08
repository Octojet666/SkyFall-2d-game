export class DialogueSystem {
  constructor(state) {
    this.state = state;
    this.active = null;
    this.npc = null;
    this.node = null;
    this.lines = [];
    this.lineIndex = 0;
    this.choices = [];
    this.choiceHandler = null;
    this.doneCallback = null;
  }
  start(npc, lines, opts = {}) {
    this.active = true;
    this.npc = npc;
    this.lines = Array.isArray(lines) ? lines.slice() : [lines];
    this.lineIndex = 0;
    this.choices = opts.choices || [];
    this.choiceHandler = opts.choiceHandler || null;
    this.doneCallback = opts.done || null;
    this.state.dialogueOpen = true;
    this.state.dialogueNpc = npc;
  }
  setDone(fn) {
    this.doneCallback = fn;
  }
  currentLine() {
    if (this.lineIndex >= this.lines.length) return null;
    return this.lines[this.lineIndex];
  }
  hasChoices() {
    return this.choices.length > 0 && this.lineIndex >= this.lines.length - 1;
  }
  choicesFor() {
    return this.choices.slice();
  }
  open(game) {
    this.game = game;
  }
  close() {
    if (this.active) this.end();
  }
  advance() {
    if (this.lineIndex < this.lines.length - 1) {
      this.lineIndex++;
      return this.currentLine();
    }
    // Past the last line the conversation is over; otherwise it would sit
    // open forever and keep the world paused behind it.
    this.end();
    return null;
  }
  choose(index) {
    const cb = this.choiceHandler;
    if (cb && typeof cb === 'function') {
      const result = cb(index, this.choices[index]);
      if (result === false) return;
    }
    this.end();
  }
  end() {
    this.active = false;
    this.state.dialogueOpen = false;
    this.state.dialogueNpc = null;
    if (this.doneCallback) {
      this.doneCallback();
    }
    this.doneCallback = null;
  }
  update(dt) {
  }
  draw(ctx, cam, ui) {
    if (!this.active) return;
    ui.drawDialogue(ctx, cam, this);
  }
}
