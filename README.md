![Clockwork logo](https://github.com/arcadiogarcia/Clockwork.js/blob/master/assets/clockwork.png?raw=true)
A lightweight modular JavaScript game engine

##Demos

[Example 1 - Paradogs](http://arcadiogarcia.github.io/Clockwork.js/examples/example1/example1.html)

[Example 2 - Flappy dog](http://arcadiogarcia.github.io/Clockwork.js/examples/example2/example2.html)

[Example 3 - Flappy dog advanced](http://arcadiogarcia.github.io/Clockwork.js/examples/example3/example3.html)

[Example 4 - Flappy dog: DOMination](http://arcadiogarcia.github.io/Clockwork.js/examples/example4/example4.html)

[Example 5 - Paradogs: The MMO](http://clockworkjsdemo1.azurewebsites.net/)

##FAQ
  - **Can I use this engine?**

  If you are developing a game (or a game-like app or website) in JavaScript, you can use Clockwork.js!

  - **Should I use this engine?**

  If you want to keep your code organized and modular, forget about the big picture and focus on implementing your game behaviour, you should use this engine.

  If you want a game engine that makes easy to start coding, but you also want to be able to extend the engine to fit your needs, you should use this engine.

  If you have no experience in videogame development, and want  to learn to write games step by step, you should use this engine.

  BUT
  
  If you are searching for a engine that does everything for you (physics, app packaging...) and lets you build a game with very little coding, you shouldn't use this engine.

  - **What does this engine do?**

  This engine is focused mainly in allowing to implement the game logic using events and event handlers, define presets (think of them as classes) that can be easily instantiated in levels, and use a modular engine so common elements (as input handlers, menu elements or even enemies) can be shared across games.
  This engine does not provide any functionality related to
  
  - **How do I use this engine?**

  Great, if you are still reading this it seems that you are interested in using the engine. To use the engine, you just need to follow the steps described in the *Get Started* section.

  - **Can I use this engine for 3D games?**

  Yes you can! All the examples provided are 2D because they use [Spritesheet.js](https://github.com/arcadiogarcia/Spritesheet.js), a 2D rendering library, but you should be able to use any 3D (or 2D) library (or write your own) if write a wrapper. Actually, in the last release there have been added a 3d collision detector and some animation proxies that allow you to render a 3D game in 2D. You can still write a wrapper for your favourite 2d/3d library.

  - **I have written a nice preset that I want to share, may I add it to the collection included in the src/presets folder**

  Of course! It doesn't mind if it implements a game element (e.g. a progress bar), or is a wrapper to use a specific [Windows10/ApacheCordova/FirefoxOS/Web/whatever] feature, you are welcome to add it to the library collection.

  - **Can I use [Some library] for the animation?**

  Yes, you will only have to write a wrapper, more info about that soon.
  
  - **Can I make a multiplayer game?**

  Since the Clockwork.js is event based, it is very easy to communicate many engine instances. There is a general-purpose  implementation already written in examples/example5, that can be adapted to fit your specific needs.

##Get started

The first step to build you game is to write the presets. You can think of them as 'classes' in classical object oriented languages such as C# and Java: they specify the properties and behaviour of a certain type of objects that will be instantiated on the level. They can inherit from other presets, or you can even use composition, telling a preset to inherit from multiple presets at the same time. Presets must be defined in a .js file following a structure that closely resembles JSON data, but including functions:

 ```javascript
var somePresets = [
{
    name: "someName",
	inherits: "someOtherPreset",
    sprite: "someSprite",
    events: [
        {
            name: "someEvent", code: function (event) {
                //TODO
            }
        },
        ...
    ],
    collision: {
        "someKindOfShape": [
            { "x": 0, "y": 0, ... },
			...
        ],
		...
    },
	vars: [
	{ name: "someVariable", value: 1 },
	...
	]
},
...
]
 ```
As you can see, you can specify many properties of the preset, but only the name is mandatory:

  - *name* : Specifies the preset name, it must be unique.
  - *inherits* : You can specify a preset from which the actual one will inherit the event handlers, sprite, collision shapes and variables (but they can be overwritten if you want to change them). Since v1.1, you can use multiple inheritance/composition, just specify an array of presets instead of a single one: the properties will be fused but all the event handlers will keep working even if they have the same name.
  - *sprite* : Specifies the spritesheet used to draw the object in the screen.
  - *events* : The event handlers will contain all the logic of your game. They are functions that will be executed when some event happens, they may accept parameters inside the event object and may also return something.
  Event names beggining with # are reserved for the engine:
    - #setup is executed when a level is loaded
	- #loop is executed each frame
	- #collide is executed when a collision is detected
  You can use any other name to handle other events (input, inter-object interaction...).
  - *collision* : Specifies the shapes that will act as hitboxes. They is an array of each category of shape, and you can define your own custom shapes (we'll get to that later).
  - *vars* : Any variable that the object may need. You can also set them in the code, but if you define them here you can easily inherit and modify	the values.

Then, you should write the levels .xml, which specify when and where will be the objects instantiated:

```xml
<levels>
  <level id="someName">
    <object name="someName" type="somePreset" x="100" y="100" z="2" vars='{"w":90}'></object>
	...
  </level>
  ...
</levels>
```

You can specify as many levels as you want, and they must have unique names.
When you load a level, all the objects that it contains will be instantiated:
  - *name* : Specifies a unique name for the object that will allow you to reference it from other objects.
  - *type* : Specifies the preset used to create the object.
  - *x*, *y*, *z*: Specify the coordinates of the object. Z is not mandatory, but recomended even in 2d games to control the order in which objects are drawn.
  - *vars* : They will be added or overwrite the preset variables.

Once you have written both the presets and the levels, you will be able to run your game:

  1. First of all, include the engine and the file with your presets:

  ```html
   <script src="Clockwork.js"></script>
   <script src="myPresets.js"></script>
  ```

  2. Instantiate the Clockwork engine:

  ```javascript
  var engineInstance = new Clockwork();
  ```

  3. Specify which animation library will you use. For 2D games, we recomend you to use [Spritesheet.js](https://github.com/arcadiogarcia/Spritesheet.js), which specifically was developed to be used with Clockwork.js. The library will handle all the rendering and the loading of the spritesheets, Clockwork.js will only tell the library what to draw.

   ```javascript
  engineInstance.setAnimationEngine(canvasAnimation);
  ```

  4. Load as many presets you neeed.

   ```javascript
  engineInstance.loadPresets(somePresets);
  engineInstance.loadPresets(otherPresets);
  ```

  5. Load the levels and use the callback to start the engine.

   ```javascript
   engineInstance.loadLevelsFromXML("levels.xml", function () {
                engineInstance.start(30, document.getElementById("canvas"));
	});  
	```
	The start method expects the fps and a DOM element that will be used for input (will register clicks, key presses...).


##Known bugs

There are no known bugs, if you find one please report it! (or even better, fix it yourself and submit a pull request).

##Code examples

Check out [examples/example1/example1.html](https://github.com/arcadiogarcia/Clockwork.js/blob/master/examples/example1/example1.html) to see how to instance the engine and create objects. You should also read [examples/example1/dogPreset.js](https://github.com/arcadiogarcia/Clockwork.js/blob/master/examples/example1/dogPreset.js) to see how to write presets, and [examples/example1/levels.xml](https://github.com/arcadiogarcia/Clockwork.js/blob/master/examples/example1/levels.xml) to see the levels structure.

Check out [examples/example2/gamePresets.js](https://github.com/arcadiogarcia/Clockwork.js/blob/master/examples/example2/gamePresets.js) to learn to write the presets needed for a basic game.

Check out [examples/example3/gamePresets.js](https://github.com/arcadiogarcia/Clockwork.js/blob/master/examples/example3/gamePresets.js) to see how to add more advanced features to the previous game.

Check out [examples/example4/DOManimation.js](https://github.com/arcadiogarcia/Clockwork.js/blob/master/examples/example4/DOManimation.js) to see how to write your own animation library.

Check out [examples/example5s](https://github.com/arcadiogarcia/Clockwork.js/blob/master/examples/example5) to see how to run  a instance of the game engine on a Node.js server to create multiplayer games easily (using Socket.io).

If you are interested in the animation and rendering, you should learn more about [Spritesheet.js](https://github.com/arcadiogarcia/Spritesheet.js), the 2D animation library specifically developed to be used with Clockwork.js. You can find the spritesheets used by the examples in [examples/shared](https://github.com/arcadiogarcia/Clockwork.js/blob/master/examples/shared). Thanks to [Silvia Barbero](http://silvishinystar.deviantart.com/) for allowing me to use her dog sprite!

##Roadmap

These items are on the roadmap:

  - **Animation library sample wrapper**
  ~~Provide an example of the methods that the animation library used must implement.~~ [examples/example4/DOManimation.js](https://github.com/arcadiogarcia/Clockwork.js/blob/master/examples/example4/DOManimation.js) shows how to write a simple animation library, and you can find more exaples in src/animation.


  - **Editor**:
  Develop a drag and drop editor to create levels more easily.


  - **More presets**
  Write presets to handle other input methods: keyboard, pointers, accelerometer...
  Also, write platform specific presets (e.g. notifications, live tiles for Windows).


  - **More collision detectors**
  Add support for more complex (e.g. concave) shapes.

##Contact

You can contact the creator of the engine at [@arcadio_g_s](http://www.twitter.com/arcadio_g_s) on Twitter.
