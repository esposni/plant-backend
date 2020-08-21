const history = {
  set: [],

  initializeNewStrokesSet: function(){
    //console.log("initializeNewStrokesSet");
    this.set.push([]);
  },
  pop: function() {
    //console.log("pop");
    return this.set.pop();
  },
  push: function(el) {
    //console.log("push",el.brushName);
    if (el instanceof Stroke){
      this.set[this.set.length-1].push(el);
    }else {
      throw new Error("Must pass a Stroke instance when you push in the history");
    }
  },
  clear: function() {
    //console.log("clear");
    this.set=[];
  }

}

class Stroke{
  constructor(brushName,strokeStyle,x,y){
    this.brushName=brushName;
    this.strokeStyle=strokeStyle;
    this.x=x;
    this.y=y;
  }
}
