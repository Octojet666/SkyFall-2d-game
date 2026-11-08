export class EntityManager {
  constructor() {
    this.entities = [];
    this._nextId = 1;
  }
  add(entity, top = false) {
    entity._id = this._nextId++;
    if (top) {
      this.entities.unshift(entity);
    } else {
      this.entities.push(entity);
    }
    return entity;
  }
  remove(entity) {
    const i = this.entities.indexOf(entity);
    if (i !== -1) this.entities.splice(i, 1);
  }
  with(f) {
    return this.entities.filter(f);
  }
  updateAll(dt) {
    const survivors = [];
    for (const e of this.entities) {
      if (e._removed) continue;
      e.update(dt);
      if (!e._removed) survivors.push(e);
    }
    this.entities = survivors;
  }
  drawAll(ctx, cam) {
    for (const e of this.entities) {
      if (e._removed) continue;
      e.draw(ctx, cam);
    }
  }
  clear() {
    this.entities.length = 0;
    this._nextId = 1;
  }
}
