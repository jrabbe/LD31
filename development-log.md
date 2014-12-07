Development Log
===============

12/06 = 11:58 pm
----------------

Insanity strikes (again). Game is more an action puzzle game than a regular "control an avatar" type game, and it means the investigated game engines are not as suitable as originally thought. It is especially the understanding of multi-entity collision detection which seems like it's out of my grasp for this challenge.

The only logical choice then is to ditch the engines and create the game using Paper.js, a "library" not intended for games as such, but for interactive visualizations on `<canvas>` elements.

12/06 = 11:26 am
----------------

From [MorpheusZ reply to "how to zoom out from center of gameworld"](http://www.html5gamedevs.com/topic/7150-how-to-zoom-out-from-center-of-gameworld/#entry53526)

```js
Light.Game.prototype.zoom = function(delta) {
  var oldScale = this.scaler.scale.x;  // We always scale both co-ordinates equally.
  var scale = oldScale + delta;
  // Don't zoom out if the whole world is visible (clip it right on the edge).
  scale = Math.max(scale, game.camera.view.width / this.mapWidth);
  scale = Math.max(scale, game.camera.view.height / this.mapHeight);
  var scaleCoef = scale / oldScale;
  var scaledMouseX = game.input.mousePointer.worldX * scaleCoef;
  var scaledMouseY = game.input.mousePointer.worldY * scaleCoef;
  var deltaMouseX = scaledMouseX - game.input.mousePointer.worldX;
  var deltaMouseY = scaledMouseY - game.input.mousePointer.worldY;
  this.scaler.scale.set(scale);
  game.world.width = scale * this.mapWidth;
  game.world.height = scale * this.mapHeight;
  game.camera.setBoundsToWorld();
  game.camera.focusOnXY(
      game.camera.view.centerX + deltaMouseX,
      game.camera.view.centerY + deltaMouseY);
};
```

12/05 = 8:16 pm
---------------

Ideas:

- zoom in and out to do actions
- motion
- chaotic action?
- you cannot be zoomed in all the time because you need to keep an eye on the beyond
- use the radius buildings
- congregate and inflate if multiple of the same color come together
- the larger they are the harder it is to counteract them
- red burn, blue freeze, green dissolve, orange cut
- the meeting of opposite colors can cause chain reactions damaging you
- you have to gobble the smaller and avoid the larger.
- as you gobble you get larger and can eat more

The size of a business dictates what happens when it intersects another.

There always pops up small businesses.

Small are more agile and can escape the larger

The larger the biz, the more delay on reactions. Momentum: the larger the more unstoppable.

Use powers to defeat other biz. Need to recharge.

Funding appears to help regain powers faster.

Zoomed out you can move between sectors, but cannot do actions.

Closeup you can do actions but hardly move. You may need to zoom out to escape a larger business.

Zooming slows with size.

You pick one of the four colors. And control that color in game.

You can micromanage one business and neglect all the rest, or control the overall patterns and let the local stuff manage itself.

Market cap == size Actions:
- merger (same color larger size)
- franchise (split)
- compete (fight)
- overtake (swallow a smaller other color biz to grow)

Power ups (or downs):
- radius : shrink slightly each “round” but move faster
- funding : grow your size
- regulation : fewer new of your color
- anti-trust : cannot grow larger than anyone else
- nationalize : your color cannot be eaten

You have to view the zoomed out view to see current power ups of the other colors.

If you stay zoomed in you may try and go against someone who’s nationalized
