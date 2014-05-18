#Cool Blocks
## The little SVG renderer that could

Cool Blocks is an SVG drawing and rendering library combining Greensock's [TweenLite] and [plugins] with good old-fashioned elbow grease. And maybe a little more than its fair share of [Lo-Dash].
###What you get
  - Unfinished and half-baked ideas
  - Code that is not at all optimized
  - A feeling of superiority

###Goals
  - Many, many more SVG properties
  - Powerful code that is light and fluffy
  - Neat things
  - Cool things

## Dependency
Yes, there is one. [insert require pun]

For development, the library is using [RequireJS] to manage the dependencies and is packaged with [r.js]. To use Cool Blocks, you will need to load it with requirejs. If you haven't already, [download a copy]!

Make your files look like this now.
```js
|-- index.html
+-- js/
     |-- lib/
     |    |-- require.js (~2.1.11)
     |    +-- blocks.min.js
     +-- main.js
```

Cool Blocks is an r.js optimized package of modules, but the library is not a module itself. To make the internal modules available to your scripts at launch, you must require blocks at the same time as your main.js.
```html
<!-- load require.js -->
<script type="text/javascript" src="js/lib/require.js"></script>

<!-- require blocks and main.js -->
<script type="text/javascript">
  require(['js/lib/blocks.min', 'js/main']);
</script>
```

Cool. You may configure your main file however you like, but be sure to include the library as a dependency. When this function is called, the blocks are ready to be pulled out of the package with `require('blocks')`.
```js
define(
[
  'jquery',
  'lib/blocks.min'
],
function($) {
  // welcome to cool blocks!
  var blocks = require('blocks');
```

Now all that's left is the good stuff!

And don't forget, Lo-Dash and TweenLite are included. You can get Lo-Dash with something like: `var _ = blocks.lib.lodash;` and TweenLite is available in the global namespace as `TweenLite`.

So go get 'em tiger. There's a lot of work to do.


### Version
Tiny

### Licenses
The licenses for Lo-Dash and Greensock's TweenLite, EasePack, and ColorPropsPlugin have been retained in the release builds of this library but are not covered under the same license as the unique code hosted in this repository. Please review and consider all terms of use carefully.
  - [Blocks license]
  - [Greensock license]
  - [Lo-Dash license]

[TweenLite]:http://www.greensock.com/why-gsap/
[plugins]:http://www.greensock.com/get-started-js/#plugins
[Lo-Dash]:http://lodash.com/
[RequireJS]:http://requirejs.org/
[r.js]:https://github.com/gruntjs/grunt-contrib-requirejs
[download a copy]:http://requirejs.org/docs/download.html
[Blocks license]:https://github.com/lifedinosaur/cool-blocks/blob/master/LICENSE
[Greensock license]:http://www.greensock.com/terms_of_use.html
[Lo-Dash license]:https://github.com/lodash/lodash/blob/master/LICENSE.txt
