class Snowflake {

   constructor() {
      this._next_part = 1;
      this.generate = this.generate.bind(this);
   }

   generate() {
      let time_part = Date.now().toString(36);
      let inc_part  = (this._next_part++).toString(36);
      return `${time_part}-${inc_part}`;
   }
}

export default (new Snowflake());
