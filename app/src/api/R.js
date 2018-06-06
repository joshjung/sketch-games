export function background(ctx, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(0, 0, 800, 600);
}

export function text(ctx, text, x, y, color, font, baseline) {
  baseline = baseline || 'hanging';

  ctx.fillStyle = color;
  ctx.font = font || '30px Arial';
  ctx.textBaseline = baseline;

  ctx.fillText(text, x, y);
}

export function circle(ctx, center, radius, stroke, fill) {
  if (fill) {
    ctx.fillStyle = fill;
  }

  ctx.beginPath();
  ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
  ctx.closePath();

  if (fill) {
    ctx.fill();
  }

  if (stroke) {
    ctx.stroke();
  }
}

export function poly(ctx, poly, {fill = undefined, angle = 0, center = [0, 0]} = {}) {
  if (fill) {
    ctx.fillStyle = fill;
  }

  if (angle || center) {
    poly = poly.concat();

    for (let i=0 ; i < poly.length-1 ; i+=2) {
      const x = poly[i],
        y = poly[i+1];
      const s = Math.sin(angle);
      const c = Math.cos(angle);
      poly[i] =   x * c - y * s + center[0];
      poly[i+1] = x * s + y * c + center[1];
    }
  }

  ctx.beginPath();
  ctx.moveTo(poly[0], poly[1]);

  for (let i=2 ; i < poly.length-1 ; i+=2) {
    ctx.lineTo( poly[i] , poly[i+1] );
  }

  ctx.closePath();

  if (fill) {
    ctx.fill();
  }
}