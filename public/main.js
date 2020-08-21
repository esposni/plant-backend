//  Enter your initialization code here

function init() {

    // Create canvas app
    const app = new App({ canvas: 'canvas',
    	                    buttons: {  clear: 'clear-btn',
                                      camera: 'camera-btn',
                                      undo: 'undo-btn' },
                          brushToolbar: 'brush-toolbar'
    	                });
    app.draw();

    const constraints = {
      video: true,
    };

    const player = document.getElementById('player');

    document.getElementById('start-capture').addEventListener("click",()=>{
      player.style.visibility="visible";
      document.getElementById('capture').style.visibility="visible";
      navigator.mediaDevices.getUserMedia(constraints)
        .then((stream) => {
          player.srcObject = stream;
        });
    });

  }
