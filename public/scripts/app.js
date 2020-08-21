class App {

  constructor(input){
    this.strokeStyle="black";
    if(typeof(input)=="object" &&
      typeof(input.canvas)=="string" &&
      typeof(input.buttons)=="object" &&
      typeof(input.buttons.clear)=="string" &&
      typeof(input.buttons.camera)=="string" &&
      typeof(input.buttons.undo)=="string" &&
      typeof(input.brushToolbar)=="string") {

      this.canvas = document.getElementById(input.canvas);
      document.getElementById(input.buttons.clear).addEventListener("click",
            ()=>{
              let ctx = this.canvas.getContext('2d');
              ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
              history.clear();
              this.captured=false;
            });

      document.getElementById(input.buttons.camera).addEventListener("click",
            ()=>{
              let dataURL = this.canvas.toDataURL();
              let fav= document.getElementById("favourites");
              fav.style="width:90%;"
              let content = document.createElement("div");
              content.className="content";
              let form = document.createElement('form');
              form.method='POST';
              form.action=document.getElementById('usr-input').value+'/favorites';

              let form_div = document.createElement("div");
              form_div.className="input-text";
              let label = document.createElement('label');
              label.htmlFor='name-input';
              label.textContent='Name:';
              let name = document.createElement('input');
              name.id='name-input';
              name.type='text';
              name.name='name';
              form_div.appendChild(label);
              form_div.appendChild(name);

              let data = document.createElement('input');
              data.type='hidden';
              data.name='dataURL';
              data.value=dataURL;
              let submit = document.createElement('input');
              submit.type='submit';
              submit.value='Save';
              let img = document.createElement("img");
              img.className='img-fav';
              img.src=dataURL;
              content.appendChild(img);
              form.appendChild(form_div);
              form.appendChild(data);
              form.appendChild(submit);
              content.appendChild(form);
              fav.appendChild(content);
            });

      this.flag=false;
      this.currX = 0;
      this.currY = 0;
      this.prevX = 0;
      this.prevY = 0;
      this.brush="pen";

      document.getElementById("PenBrush").addEventListener("click",
            ()=>{
              this.brush="pen";
              //console.log(this.brush);
            });
      document.getElementById("DiscBrush").addEventListener("click",
            ()=>{
              this.brush="disc";
              //console.log(this.brush);
            });
      document.getElementById("StarBrush").addEventListener("click",
            ()=>{
              this.brush="star";
              //console.log(this.brush);
            });

      this.snap;
      this.captured=false;
        document.getElementById(input.buttons.undo).addEventListener("click",
          ()=>{
            //console.log('undo');
            let ctx = this.canvas.getContext('2d');
            if (this.captured){
              ctx.drawImage(this.snap, 0, 0, this.canvas.width, this.canvas.height);
            }else {
              ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            }
            let pop=history.pop();
            let old_set=history.set;
            //console.log(history.set);
            if (pop!=undefined){
              for (let z=0;z<old_set.length;z++){
                for (let i=0; i<old_set[z].length;i++){
                    ctx.beginPath();
                    let brush_;
                    switch(old_set[z][i].brushName) {
                        case "pen": brush_ = new PenBrush();
                                    if (i>=1){
                                      ctx.moveTo(old_set[z][i-1].x,old_set[z][i-1].y);
                                    }
                                    brush_.draw(ctx,old_set[z][i].strokeStyle,old_set[z][i].x,old_set[z][i].y);
                                    break;
                        case "disc":brush_ = new DiscBrush();
                                    brush_.draw(ctx,old_set[z][i].strokeStyle,old_set[z][i].x,old_set[z][i].y);
                                    break;
                        case "star":brush_ = new StarBrush();
                                    brush_.draw(ctx,old_set[z][i].strokeStyle,old_set[z][i].x,old_set[z][i].y);
                                    break;
                    }
                    ctx.closePath();
                }
              }
            }
          });
          document.getElementById("color-picker").addEventListener("change",()=>{
            this.strokeStyle=document.getElementById("color-picker").value;
          });

          document.getElementById('capture').addEventListener('click', () => {
            // Draw the video frame to the canvas.
            let player = document.getElementById('player');
            let ctx = this.canvas.getContext('2d');
            history.clear();
            ctx.drawImage(player, 0, 0, this.canvas.width, this.canvas.height);
            let dataURL = this.canvas.toDataURL();
            this.snap=new Image();
            this.snap.src= dataURL;
            this.captured=true;
          });

          document.getElementById('stop-capture').addEventListener('click', () => {
            let player = document.getElementById('player');
            try {
              player.srcObject.getVideoTracks().forEach(track => track.stop());
            } catch (e) {
              console.log(e);
            }
            player.style.visibility="hidden";
            document.getElementById('capture').style.visibility="hidden";
          });

      }else{
        if (typeof(input)==undefined)
          throw new Error("The App class constructor is undefined");
        if (typeof(input)!="object")
          throw new Error("The App class constructor is not an object");
        if(document.getElementById(input.canvas).nodeName.toLowerCase()!="canvas")
          throw new Error("The argument options object is not pointing to a canvas element under the 'canvas' property");
        if (typeof(input)=="number")
          throw new Error("The App class constructor is a number");
        if (Array.isArray(input))
          throw new Error("The App class constructor is an array");
        if (typeof(input)=="boolean")
          throw new Error("The App class constructor is a boolean");
      }
    }

    draw(){
        let ctx = this.canvas.getContext('2d');
        //console.log(this.brush);
        this.canvas.addEventListener("mousemove", (e)=>{
          if (this.flag) {
              this.prevX=this.currX;
              this.prevY=this.currY;
              this.currX = e.clientX - this.canvas.offsetLeft;
              this.currY = e.clientY - this.canvas.offsetTop;

              ctx.beginPath();
              let brush_;
              switch(this.brush) {
                  case "pen": brush_ = new PenBrush();
                              ctx.moveTo(this.prevX,this.prevY);
                              brush_.draw(ctx,this.strokeStyle,this.currX,this.currY);
                              history.push(new Stroke("pen",this.strokeStyle,this.currX,this.currY));
                              break;
                  case "disc":brush_ = new DiscBrush();
                              brush_.draw(ctx,this.strokeStyle,this.currX,this.currY);
                              history.push(new Stroke("disc",this.strokeStyle,this.currX,this.currY));
                              break;
                  case "star":brush_ = new StarBrush();
                              brush_.draw(ctx,this.strokeStyle,this.currX,this.currY);
                              history.push(new Stroke("star",this.strokeStyle,this.currX,this.currY));
                              break;
              }
              ctx.closePath();
          }
        });
        this.canvas.addEventListener("mousedown", function (e) {
          history.initializeNewStrokesSet();
          this.prevX=this.currX;
          this.prevY=this.currY;
          this.currX = e.clientX - this.canvas.offsetLeft;
          this.currY = e.clientY - this.canvas.offsetTop;
          this.flag = true;
        }.bind(this));

        this.canvas.addEventListener("mouseup", ()=> { this.flag = false; });
        this.canvas.addEventListener("mouseout", ()=>{ this.flag = false; });

        this.canvas.addEventListener('touchstart', (e)=>{
          // Cache the client X/Y coordinates
          history.initializeNewStrokesSet();
          this.prevX=this.currX;
          this.prevY=this.currY;
          this.currX = e.touches[0].clientX;
          this.currY =e.touches[0].clientY;
          this.flag = true;
        }, false);
        
        this.canvas.addEventListener('touchend', (e)=>{
          this.flag = false;
        }, false);

        this.canvas.addEventListener('touchmove', (event)=>{
          // If there's exactly one finger inside this element
          if (event.targetTouches.length == 1) {
            var touch = event.targetTouches[0];

            if (this.flag) {
              this.prevX=this.currX;
              this.prevY=this.currY;
              this.currX = touch.pageX;
              this.currY = touch.pageY;

              ctx.beginPath();
              let brush_;
              switch(this.brush) {
                  case "pen": brush_ = new PenBrush();
                              ctx.moveTo(this.prevX,this.prevY);
                              brush_.draw(ctx,this.strokeStyle,this.currX,this.currY);
                              history.push(new Stroke("pen",this.strokeStyle,this.currX,this.currY));
                              break;
                  case "disc":brush_ = new DiscBrush();
                              brush_.draw(ctx,this.strokeStyle,this.currX,this.currY);
                              history.push(new Stroke("disc",this.strokeStyle,this.currX,this.currY));
                              break;
                  case "star":brush_ = new StarBrush();
                              brush_.draw(ctx,this.strokeStyle,this.currX,this.currY);
                              history.push(new Stroke("star",this.strokeStyle,this.currX,this.currY));
                              break;
              }
              ctx.closePath();
            }
          }
        }, false);
    }

    static get defaultStrokeStyle(){
      return "black";
    }

    set setStrokeStyle(color){
      if (typeof(color)=="string"){
        this.strokeStyle=color;
      }else {
        throw new Error("The passed parameter is not a String");
      }
    }

}
