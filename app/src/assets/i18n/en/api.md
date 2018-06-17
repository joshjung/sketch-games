# Overview

The SuperMini Games API has been designed so that you can write compact games very quickly.

## Game Development 101

Almost every video game has these two stages:

1. Initialization
2. Game Loop

**Initialization** is where you create all your "starting state" of the game. Typically you will use this to setup things like
sprites (images), characters, the starting score, etc.

The **game loop** is a special function that runs all your AI, rendering, and game logic.

**All the code you edit in SuperMini Games is contained within the game loop.**

## Game Loop

When you click **Code** when in the developer playground and edit the code you can then click "Save and Reset" or "Commit Code" (if it is not your game) to
test out changes.

Every line of you code you write is contained within the game loop function. When the game is displayed, this
function is called every frame.

The game loop function is called something like this:

```
loop(E, R, C, G, I, T, M) {
  //
  // All the code you write runs in this context!
  //
}
```

## API Objects

When the game loop function is called, you are provided with a set of objects that provide convenience methods
for you to render, store state, and check on user input:

**`E`**: Elapsed time since the last call to the game loop, in seconds (e.g. 0.167)

**`R`**: Render functions not provided by the standard Javascript canvas API.

**`C`**: Canvas context object used to draw onto the game canvas. You can read more about it [here](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D).

**`G`**: Global object you can use to store any variables your game needs.

**`I`**: Input object containing information on keys, mouse location (coming soon)

**`T`**: Time information other than elapsed.

**`M`**: Math functions not provided by the `Math` Javascript object.

## `E`

The elapsed time number `E` is the time since the last game loop, in seconds. You can use this to create smooth movements.

[Live Example Here](http://www.supermini.games/games/playground/5b0eee1c0268512aee299516)

```
if (!G.init) {
  G.angle = 0;
  G.init = true;
}

G.angle += Math.PI * E; // Rotate the object smoothly

const points = [0, 0, 0, 100, 100, 100, 100, 0];

R.poly(points, {
  fill: 'red',
  angle: G.angle,
  center: [400, 300]
});
```

## `R`

The `R` object contains render methods you can use to draw things on the screen, like text or circles:

[Live Example Here](http://www.supermini.games/games/playground/5b0ef4d90268512aee299518)

```
// text, x, y, fill, font
R.text('Hello World', 10, 20, 'red', '30px Arial');

// center, radius, stroke, fill
R.circle([400, 300], 50, 'blue', 'blue');

// points, {fill, angle, center}
R.poly([100, 100, 200, 200, 100, 200], {
  fill: 'green',
  angle: Math.PI / 3,
  center: [300, 300]
});
```

*R.drawImage(assetId, options)*

The `drawImage(assetId, options)` method lets you draw image assets you have uploaded in your assets library to the canvas.

For example:

    R.drawImage('asset0', {
      sourceX: 0,        // (optional) The clipping pixel x location to read from in the asset image
      sourceY: 0,        // (optional) The clipping pixel y location to read from in the asset image
      sourceWidth: 30,   // (optional) The clipping pixel width to read from in the asset image
      sourceHeight: 30,  // (optional) The clipping pixel height to read from in the asset image
      x: 5,              // The canvas pixel x location to draw the image
      y: 5,              // The canvas pixel y location to draw the image
      width: 200,        // (optional) The width to draw the image on the canvas
      height: 200,       // (optional) The height to draw the image on the canvas
      angle: G.box.angle // (optional) An angle to rotate the image (in radians)
    });

## `C`

The `C` object is the canvas context object used to draw onto the game canvas. You can read more about it [here](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D).

[Live Example Here](http://www.supermini.games/games/playground/5b0ef6080268512aee299519)

```
C.fillStyle = 'rgba(0, 120, 0, 0.5)';
C.fillRect(0, 0, 800, 600);
```

## `G`

The `G` object is an object you can populate with whatever you want. It will stick around as long as your game is running, until the game is reset.

When the game is reset, the object is cleared to an empty Javascript object.

You can use the G object, if it is empty, to determine when your game has first started.

[Live Example Here](http://www.supermini.games/games/playground/5b0ef6760268512aee29951a)

```
if (!G.init) {
  G.counter = 0;
  G.init = true;
}

G.counter++;

R.text(G.counter, 10, 10);
```

## `I`

The `I` object is used for keyboard and mouse input.

Coming soon:

* Touch events (mobile)

[Live Example Here](http://www.supermini.games/games/playground/5b0ef6f80268512aee29951b)

```
if (I.keyDown(I.DOWN)) R.text('DOWN is pressed', 0, 0);
if (I.keyDown(I.UP))   R.text('UP is pressed', 0, 0);
if (I.keyDown(I.RIGHT))R.text('RIGHT is pressed', 0, 0);
if (I.keyDown(I.LEFT)) R.text('LEFT is pressed', 0, 0);
if (I.keyDown(I.SPACE))R.text('SPACE is pressed', 0, 0);
if (I.keyDown(I.ENTER))R.text('ENTER is pressed', 0, 0);
if (I.keyDown(I.A))    R.text('A is pressed', 0, 0);
if (I.keyDown(I['3'])) R.text('3 is pressed', 0, 0);
// You can also access I.B, I.C, I['3'], etc.

if (I.mouseX >= 0) {
  R.text(`Mouse: ${I.mouseX}, ${I.mouseY}`);
}

```

## `T`

The `T` object contains some extra information about time.

* `T.elapsed`: identical to `E`
* `T.now`: the number of milliseconds since 1970
* `T.total`: the total time in milliseconds the game has been running (minus pauses)

## `M`

The `M` object is used for math operations.

* `M.seed(N)`: pass in any Number to seed the random number generator.
* `M.rand()`: get a random number from 0.0 - 1.0 provided by the seed.
