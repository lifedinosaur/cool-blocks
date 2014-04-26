#Cool Blocks
## The little SVG renderer that could

Cool Blocks is an SVG drawing and rendering library combining Greensock's [TweenLite] and [plugins] with good old fashioned elbow grease. And maybe a little more than its fair share of [Lo-Dash].
###What you get
  - Unfinished and half-baked ideas
  - Code that is not at all optimized
  - A feeling of superiority*

###Goals
  - Many, many more SVG properties
  - Powerful code that is light and fluffy
  - Neat things
  - Cool things

## Dependencies
Yes, there are a few. You must have them. (jQuery is not required for the library but it is nice to have on the front-end and will be used for demos.) For development, the library is
using [RequireJS] to manage the dependencies.

To tell the blocks where to find you, here is a typical require.config and main define:
```sh
require.config(
{
  baseUrl: 'js/',
  paths:
  {
    blocks: 'lib/blocks/',
    jquery: 'lib/jquery',
    lodash: 'lib/lodash'
  }
});

define(
[
  'jquery',
  'lodash',
  'lib/blocks',
  'lib/greensock'
],
function($, _, blocks) {
...
```
So go get 'em tiger. There's a lot of work to do.

### Version
Tiny

###License
[Blocks license]

*Feelng of superiority not guaranteed.

[TweenLite]:http://www.greensock.com/why-gsap/
[plugins]:http://www.greensock.com/get-started-js/#plugins
[Lo-Dash]:http://lodash.com/
[RequireJS]:http://requirejs.org/
[Blocks license]:http://opensource.org/licenses/MIT
