class PenBrush {

    constructor() {
        this.opacity = 1;
        this.name = "PenBrush";
    }

    draw(ctx, strokeStyle, x, y) {
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = 10;
        ctx.lineTo(x, y);
        ctx.stroke();
    }

}

class DiscBrush {

    constructor() {
        this.opacity = 1;
        this.name = "PenBrush";
    }

    draw(ctx, strokeStyle, x, y) {
        ctx.lineJoin = ctx.lineCap = 'round';
        ctx.lineWidth=40;
        ctx.strokeStyle = strokeStyle;
        ctx.lineTo(x, y);
        ctx.stroke();
    }

}

class StarBrush {

    constructor() {
        this.opacity = 1;
        this.name = "PenBrush";
    }

    draw(ctx, strokeStyle, x, y) {
      var alpha = (2 * Math.PI) / 10;
      var radius = 12;
      for(var i = 11; i != 0; i--)
      {
        var r = radius*(i % 2 + 1)/2;
        var omega = alpha * i;
        ctx.lineWidth=1;
        ctx.strokeStyle = strokeStyle;
        ctx.lineTo((r * Math.sin(omega)) + x, (r * Math.cos(omega)) + y);
      }
      ctx.fillStyle =strokeStyle;
      ctx.fill();
      ctx.stroke();

    }

}
