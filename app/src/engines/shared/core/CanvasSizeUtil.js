/**
 * Right now we handle the following scenarios:
 *
 * 1) Vertical mobile device (leave bottom room to display the automated controls)
 * 2) Desktop
 *
 * We calculate our target canvas position (x, y) and size (width and height).
 *
 * As of when I'm writing this the position is just always going to be {0, 0}, but I want this to be generic.
 *
 * @param parentContainer A Rectangle (e.g Phaser CE Rectangle or Object with same properties) representing the parent
 */
export function calculateCanvasPositionAndSize({gameWidth, gameHeight}, {containerWidth, containerTop, containerHeight}, {showControlsIfMobile = true}) {
  if (!gameWidth || !gameHeight || !containerWidth || (containerTop === undefined) || !containerHeight) {
    throw Error('Please provide gameWidth, gameHeight, containerWidth, containerTop, containerHeight');
  }

  // On mobile, force the canvas width to be such that there is always room for the controls.

  // We use window with and height on mobile. Not ideal, but whatevs.
  const ww = window.innerWidth;
  const wh = window.innerHeight;

  const finalCanvasRect = {
    left: 0,
    top: 0,
    width: containerWidth
  };

  // Note: for now the height of the canvas is always relative to the width, so we just calculate the target width
  // and the height will follow.

  // 1) VERTICAL MOBILE DEVICE
  if (ww < wh && ww < 768) {
    // Leave room for the controls
    const maxHeightOfCanvas = wh - (showControlsIfMobile ? 320 : 0);
    const calcHeightOfCanvas = ww * (gameHeight / gameWidth);

    if (calcHeightOfCanvas > maxHeightOfCanvas) {
      finalCanvasRect.width = maxHeightOfCanvas * (gameWidth / gameHeight);
    }
  } else {
    // 2) DESKTOP
    const maxCanvasHeight = wh - containerTop - 40; // Give 40 pixels of padding for bottom of screen

    if (containerHeight > maxCanvasHeight) {
      finalCanvasRect.width = maxCanvasHeight * (gameWidth / gameHeight);
    }
  }

  finalCanvasRect.width = Math.min(finalCanvasRect.width, containerWidth);

  finalCanvasRect.height = finalCanvasRect.width * (gameHeight / gameWidth);

  finalCanvasRect.gameScaleX = finalCanvasRect.width / gameWidth;
  finalCanvasRect.gameScaleY = finalCanvasRect.height / gameHeight;

  return finalCanvasRect;
}