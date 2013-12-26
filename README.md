Calculator
==============

See the [demo page](http://e-math.github.com/calculator).

What?
-----
A simple calculator that can be embedded in a web-page. 

How?
----
Calculator is a jQuery-plugin and can be embedded on any web page
by including `calculator.js`-file and defining some html-element
as a graphtool with: `$('#mydiv').calculator()`.

Emathtable depends on external JavaScript libraries:
* MathQuill
* jQuery

Who?
----
The tool was developed in EU-funded [E-Math -project](http://emath.eu) by
* Rolf Lindén
and the copyrights are owned by [Four Ferries oy](http://fourferries.fi).

License?
--------
The tool is licensed under [GNU AGPL](http://www.gnu.org/licenses/agpl-3.0.html).
The tool depends on some publicly available open source components with other licenses:
* [jQuery](http://jquery.com) (MIT-license)
* [MathQuill](http://mathquill.com/) (GNU LGPL)



Usage
======
Initing a calculator
----

```javascript
jQuery('#box').calculator();
```
