# Clockwork.js
A lightweight modular JavaScript game engine
![Clockwork logo](https://github.com/arcadiogarcia/Clockwork.js/blob/master/assets/clockwork.png?raw=true)
**Work in progress! Come back soon to see how to create awesome games with Clockwork.js**

##FAQ
  - *Can I use this engine?*

  If you are developing a game (or a game-like app or website) in JavaScript, you can use Clockwork.js!

  - *Should I use this engine?*

  If you want to keep your code organized and modular, forget about the big picture and focus on implementing your game behaviour, you should use this engine.

  If you want a game engine that makes easy to start coding, but you also want to be able to extend the engine to fit your needs, you should use this engine.

  If you have no experience in videogame development, and want  to learn to write games step by step, you should use this engine.

  BUT
  
  If you are searching for a engine that does everything for you (physics, app packaging...) and lets you build a game with very little coding, you shouldn't use this engine.

  - *What does this engine do?*

  This engine is focused mainly in allowing to implement the game logic using events and event handlers, define presets (think of them as C#/Java classes) that can be easily instantiated in levels, and use a modular engine so common elements (as input handlers, menu elements or even enemies) can be shared across games.
  This engine does not provide any functionality related to
  
  - *How do I use this engine?*

  Great, if you are still reading this it seems that you are interested in using the engine. To use the engine, you just need to follow the steps described in the *Get Started* section.

  - *Can I use this engine for 3D games?*

  Yes you can! All the examples provided are 2D because they use [Spritesheet.js](https://github.com/arcadiogarcia/Spritesheet.js), a 2D rendering library, but you should be able to use any 3D (or 2D) library (or write your own) if write a wrapper (stay tuned for more info about this).

  - *I have written a nice preset that I want to share, may I add it to the collection included in the src/presets folder*

  Of course! It doesn't mind if it implements a game element (e.g. a progress bar), or is a wrapper to use a specific [Windows10/ApacheCordova/FirefoxOS/Web/whatever] feature, you are welcome to add it to the library collection.

##Examples

Check out [examples/example1/example1.html](https://github.com/arcadiogarcia/Clockwork.js/blob/master/examples/example1/example1.html) to see how to instance the engine and create objects. You should also read [examples/example1/dogPreset.js](https://github.com/arcadiogarcia/Clockwork.js/blob/master/examples/example1/dogPreset.js) to see how to write presets, and [examples/example1/levels.xml](https://github.com/arcadiogarcia/Clockwork.js/blob/master/examples/example1/levels.xml) to see the levels structure.

Check out [examples/example2/gamePresets.js](https://github.com/arcadiogarcia/Clockwork.js/blob/master/examples/example2/gamePresets.js) to learn to write the presets needed for a basic game.

Check out [examples/example3/gamePresets.js](https://github.com/arcadiogarcia/Clockwork.js/blob/master/examples/example2/gamePresets.js) to see how to add more advanced features to the previous game.

If you are interested in the animation and rendering, you should learn more about [Spritesheet.js](https://github.com/arcadiogarcia/Spritesheet.js), the 2D animation library specifically developed to be used with Clockwork.js. You can find the spritesheets used by the examples in [examples/shared](https://github.com/arcadiogarcia/Clockwork.js/blob/master/examples/shared). Thanks to [Silvia Barbero](http://silvishinystar.deviantart.com/) for allowing me to use her dog sprite!

##Known bugs

There are no known bugs, if you find one please report it! (or even better, fix it yourself and submit a pull request).

##Roadmap

These items are on the roadmap:

  -**Animation library sample wrapper**
  Provide an example of the methods that the animation library used must implement.

  - **Editor**:
  Develop a drag and drop editor to create levels more easily.

  - **More presets**
  Write presets to handle other input methods: keyboard, pointers, accelerometer...
  Also, write platform specific presets (e.g. notifications, live tiles for Windows).

  - **More collision detectors**
  Add support for more complex (e.g. concave) shapes.

  ##Contact

  You can contact the creator of the engine at [@arcadio_g_s](http://www.twitter.com/arcadio_g_s) on Twitter.