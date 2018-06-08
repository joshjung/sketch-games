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

export function circle(ctx, center, radius, strokeStyle, fillStyle) {
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
  }

  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
  }

  ctx.beginPath();
  ctx.arc(center[0], center[1], radius, 0, 2 * Math.PI);
  ctx.closePath();

  if (fillStyle) {
    ctx.fill();
  }

  if (strokeStyle) {
    ctx.stroke();
  }
}

export function rect(ctx, topLeft, widthHeight, strokeStyle, fillStyle) {
  if (fillStyle) {
    ctx.fillStyle = fillStyle;
  }

  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
  }

  ctx.fillRect(topLeft[0], topLeft[1], widthHeight[0], widthHeight[1]);

  if (fillStyle) {
    ctx.fill();
  }

  if (strokeStyle) {
    ctx.stroke();
  }
}

export function poly(ctx, poly, {fill = undefined, angle = 0, center = [0, 0]} = {}) {
  if (fill) {
    ctx.fillStyle = fill;
  }

  if (!poly || !(poly instanceof Array)) {
    throw new Error('Polygon provided to poly was not an Array!');
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