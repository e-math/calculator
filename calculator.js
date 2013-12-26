/***
|Name|Calculator|
|Version|1.3|
|Author|Rolf Lindén (rolind@utu.fi)|
|Type|plugin|
|Requires|jQuery 1.4.3 or newer, jQuery UI 1.8.16 or newer.|
|Description|Simulates the basic functionality of a handheld calculator using Javascript backend to do the actual heavylifting. Uses MathQuill and jQuery for the UI.|
!!!!!Revisions
<<<
20130906.1129 ''Version 1.3''
* Fixed fraction typing bug. Changed the functionality of other similar keys.
* Added keyboard support for calculator buttons.

20130905.0959 ''Version 1.2''
* Fixed mathquill selection bug.

20130829.1012 ''Version 1.1''
* Changed utf8 characters to their ascii representations to avoid server side character encoding issues.

20130822.1431 ''Version 1''
* Fixed large factorial hang up.
* Fixed button caption selection bug.
* Added debug output mode.
* Rudimentary handling for superscript exponents.
* Handling for infinite values.

20130404.0906 ''Version 0.03''
* Works with both old and new jQuery versions (attr / prop both supported).
* Adds 'attachables' and 'press' methods to the API to enable interaction with external modules.

20121212.1454 ''Version 0.02''
* Adds copy-paste to old inputs and outputs.
* Adds ans function and ans button.
* Adds real-time computation of input (feels better this way).
* No longer takes empty input.
<<<
!!!!!Code
***/

//{{{

/**
 * Simple Offline Calculator
 * 
 * Simulates the basic functionality of a handheld calculator using
 * Javascript backend to do the actual heavylifting. Uses MathQuill and
 * jQuery for the UI.
 * 
 * Created by: E-Math -project ( http://emath.eu )
 * @version 1.3
 * @author Rolf Lindén (rolind@utu.fi)
 * 
 * Copyright: Four Ferries oy
 *   http://fourferries.fi
 * License: GNU AGPL
 */
(function ($) {
	{ /** CSS & glyphs               **/
		var sCSS =
		 '	.calculator {'
		+'      width: 270px;'
		+'		display:inline-block;'
		+'		background-color:#fcfcfc;'
		+'		padding:20px;'
		+'	}'
		+'	.lineId {'
		+'      float: left;'
		+'      text-align: right;'
		+'      color: blue;'
		+'      padding-left: 5px;'
		+'      padding-right: 5px;'
		+'      font-size: 10px;'
		//+'      width: 45px;'
		+'	}'
		+'	.calcBtn {'
		+'		width: 50px;'
		+'		margin: 2px;'
		+'		height: 30px;'
		+'		display: inline-block;'
		+'		/*background-color : #ccc;*/'
		+'		padding: 0px;'
        +'      -webkit-user-select: none;'
        +'      -moz-user-select: none;'
        +'      -khtml-user-select: none;'
        +'      -ms-user-select: none;'
		+'		vertical-align: text-top;'
		+'		display: inline-block;'
		+'		*display: inline;'
		+'		/*vertical-align: baseline;*/'
		+'		/*margin: 0 2px;*/'
		+'		outline: none;'
		+'		cursor: pointer;'
		+'		text-align: center;'
		+'		text-decoration: none;'
		+'		text-shadow: 0 1px 1px rgba(0,0,0,.3);'
		+'		-webkit-border-radius: 2px;'
		+'		border-radius: 2px;'
		+'		-webkit-box-shadow: 0 1px 2px rgba(0,0,0,.2);'
		+'		box-shadow: 0 1px 2px rgba(0,0,0,.2);'
        +'      -webkit-user-select: none;'
        +'      -moz-user-select: none;'
        +'      -khtml-user-select: none;'
        +'      -ms-user-select: none;'
		+'	}'
		+'	.calcBtn:hover {'
		+'		text-decoration: none;'
		+'	}'
		+'	.calcBtn:active {'
		+'		position: relative;'
		+'		top: 1px;'
		+'	}'
		+'	span#in.mathquill-editable.hasCursor, span#in.mathquill-editable .hasCursor {'
		+'	  -webkit-box-shadow: none;'
		+'	  box-shadow: none;'
		+'	}'
		+'	span#in.mathquill-editable .cursor {'
		+'		border-left: 1px solid black;'
		+'		margin-right: -1px;'
		+'		position: relative;'
		+'		z-index: 1;'
		+'	}'
		+'	span#in.mathquill-rendered-math {'
		+'		border: 0px !important;'
		+'		box-shadow: 0 0 0px 0px white !important;'
		+'		width: 100%;'
		+'	}'
		+'	/* white */'
		+'	.white {'
		+'		color: #303030;'
		+'		border: solid 1px #b7b7b7;'
		+'		background: #fff;'
		+'		background: -webkit-gradient(linear, left top, left bottom, from(#fff), to(#ededed));'
		+'		background: -moz-linear-gradient(top,  #fff,  #ededed);'
		+'		filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#ffffff\', endColorstr=\'#ededed\');'
		+'	}'
		+'	.white:hover {'
		+'		background: #ededed;'
		+'		background: -webkit-gradient(linear, left top, left bottom, from(#fff), to(#dcdcdc));'
		+'		background: -moz-linear-gradient(top,  #fff,  #dcdcdc);'
		+'		filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#ffffff\', endColorstr=\'#dcdcdc\');'
		+'	}'
		+'	.white:active {'
		+'		color: #999;'
		+'		background: -webkit-gradient(linear, left top, left bottom, from(#ededed), to(#fff));'
		+'		background: -moz-linear-gradient(top,  #ededed,  #fff);'
		+'		filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#ededed\', endColorstr=\'#ffffff\');'
		+'	}'
		+'	/* gray */'
		+'	.gray {'
		+'		color: #202020;'
		+'		border: solid 1px #a7a7a7;'
		+'		background: #eee;'
		+'		background: -webkit-gradient(linear, left top, left bottom, from(#eee), to(#dcdcdc));'
		+'		background: -moz-linear-gradient(top,  #eee,  #dcdcdc);'
		+'		filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#eeeeee\', endColorstr=\'#dcdcdc\');'
		+'	}'
		+'	.gray:hover {'
		+'		background: #ededed;'
		+'		background: -webkit-gradient(linear, left top, left bottom, from(#fff), to(#dcdcdc));'
		+'		background: -moz-linear-gradient(top,  #fff,  #dcdcdc);'
		+'		filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#ffffff\', endColorstr=\'#dcdcdc\');'
		+'	}'
		+'	.gray:active {'
		+'		color: #999;'
		+'		background: -webkit-gradient(linear, left top, left bottom, from(#ededed), to(#fff));'
		+'		background: -moz-linear-gradient(top,  #ededed,  #fff);'
		+'		filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#ededed\', endColorstr=\'#ffffff\');'
		+'	}'
		+'	/* red */'
		+'	.red {'
		+'		color: #faddde;'
		+'		border: solid 1px #980c10;'
		+'		background: #d81b21;'
		+'		background: -webkit-gradient(linear, left top, left bottom, from(#ed1c24), to(#aa1317));'
		+'		background: -moz-linear-gradient(top,  #ed1c24,  #aa1317);'
		+'		filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#ed1c24\', endColorstr=\'#aa1317\');'
		+'	}'
		+'	.red:hover {'
		+'		background: #b61318;'
		+'		background: -webkit-gradient(linear, left top, left bottom, from(#c9151b), to(#a11115));'
		+'		background: -moz-linear-gradient(top,  #c9151b,  #a11115);'
		+'		filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#c9151b\', endColorstr=\'#a11115\');'
		+'	}'
		+'	.red:active {'
		+'		color: #de898c;'
		+'		background: -webkit-gradient(linear, left top, left bottom, from(#aa1317), to(#ed1c24));'
		+'		background: -moz-linear-gradient(top,  #aa1317,  #ed1c24);'
		+'		filter:  progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#aa1317\', endColorstr=\'#ed1c24\');'
		+'	}'
		+'	/* green */'
		+'	.green {'
		+'		color: #e8f0de;'
		+'		border: solid 1px #538312;'
		+'		background: #64991e;'
		+'		background: -webkit-gradient(linear, left top, left bottom, from(#7db72f), to(#4e7d0e));'
		+'		background: -moz-linear-gradient(top, #7db72f, #4e7d0e);'
		+'		filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#7db72f\', endColorstr=\'#4e7d0e\');'
		+'	}'
		+'	.green:hover {'
		+'		background: #538018;'
		+'		background: -webkit-gradient(linear, left top, left bottom, from(#6b9d28), to(#436b0c));'
		+'		background: -moz-linear-gradient(top, #6b9d28, #436b0c);'
		+'		filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#6b9d28\', endColorstr=\'#436b0c\');'
		+'	}'
		+'	.green:active {'
		+'		color: #a9c08c;'
		+'		background: -webkit-gradient(linear, left top, left bottom, from(#4e7d0e), to(#7db72f));'
		+'		background: -moz-linear-gradient(top, #4e7d0e, #7db72f);'
		+'		filter: progid:DXImageTransform.Microsoft.gradient(startColorstr=\'#4e7d0e\', endColorstr=\'#7db72f\');'
		+'	}'
		+'	.enterBtn {'
		+'		height: 64px;'
		+'		margin-bottom: -34px;'
		+'	}'
		+'	.sqrtBtn {'
		+'		letter-spacing: -0.2em;'
		+'	}'
		+'	.SEcorner { border-radius: 2px 2px 15px 2px; }'
		+'	.SWcorner { border-radius: 2px 2px 2px 15px; }'
		+'	.NEcorner { border-radius: 2px 15px 2px 2px; }'
		+'	.NWcorner { border-radius: 15px 2px 2px 2px; }'
		+'	.zeroBtn {'
		+'		width: 104px;'
		+'	}'
		+'	.emptyContainer {'
		+'		/*background-color : inherit*/;'
		+'		height: 0px;'
		+'		z-index: -100;'
		+'	}'
		+'	.calcNumberBtn {'
		+'		background-color : #eee !important;'
		+'	}'
		+'	.clearBtn {'
		+'		background-color : #e88;'
		+'	}'
		+'	div.inOld span.mathquill-embedded-latex, div.outOld span.mathquill-rendered-math {'
		+'		cursor : pointer;'
		+'	}'
		+'	.calcInput {'
		+'		width : 100%;'
		+'		resize: none;'
		+'		background-color: #eff8ff;'
		+'		margin: 0px;'
		+'		border: none;'
		+'		padding-left:5px;'
		+'		font: 14px "Lucida Grande", "Trebuchet MS", Verdana, sans-serif;'
		+'		font-family: \'Junction\';'
		+'		font-weight: normal;'
		+'		line-height: 1.34em;'
		+'	}'
		+'	.inOld {'
		+'		background-color: #f8f8f8;'
		+'		width : 100%;'
		+'		resize: none;'
		+'		margin: 0px;'
		+'		border: none;'
		+'		padding-top: 5px;'
		+'		padding-bottom: 5px;'
		+'		padding-left: 5px;'
		+'	}'
		+'	.outOld {'
		+'		text-align: right;'
		+'		padding-right:10px;'
		+'		padding-top: 5px;'
		+'		padding-bottom: 5px;'
		+'	}'
		+'	.calcResult {'
		+'		text-align: right;'
		+'		padding-right:10px;'
		+'	}'
		+'	.inputDisplay {'
		+'		width: 264px;'
		+'		height: 125px;'
		+'		resize: vertical;'
		+'		overflow-x: hidden;'
		+'		overflow-y: auto;'
		+'		min-height: 50px;'
		+'		border: solid 1px #ccc;'
		+'		background-color: #fff;'
		+'		margin-left: 2px;'
		+'		margin-bottom: 2px;'
		+'	}';
	}
	{ /**  Calculator functionality  **/
		{ /* Math library extensions */
			/**
			 * Adds 10-base logarithm to Math library.
			 */
			Math.logTen = function(x) { return Math.log(x) * Math.LOG10E; }

			/**
			 * Adds factorial to Math library.
			 * 
			 * Implementation doesn't do memorization or any of the numerical
			 * accuracy improvements.
			 */
			Math.factorial = function(num) {
                if ((typeof(num) === 'number') && (num >= 0)) { 
                    if (num >= 1000) return(Number.POSITIVE_INFINITY); // Javascript's numeric capabilities stop much earlier than this, on the test bench the limit is 170.
                    //if ((n===+n) && (n!==(n|0))) return(undefined); // Not defined for decimals. Would require an implementation of the Gamma function.
                    
                    var result = 1;
                    for (var i = 2; i <= num; i++) result *= i;
                    return(result);
                } else return(undefined); // Unprocessed cases.
			}
			
			/**
			 * Adds hyperbolic sine to Math library.
			 */
			Math.sinh = function (aValue) { return (Math.pow(Math.E, aValue) - Math.pow(Math.E, -aValue)) / 2;	}
			
			/**
			 * Adds hyperbolic cosine to Math library.
			 */
			Math.cosh = function (aValue) { return (Math.pow(Math.E, aValue) + Math.pow(Math.E, -aValue)) / 2; }
			
			Math.ans = function(n, randomName) {
				return typeof randomName != 'undefined' ? parseFloat(randomName.data('ans-' + n)) : undefined;
			}
			
			Math.inp = function(n, randomName) {
				return typeof randomName != 'undefined' ? randomName.data('inp-' + n) : undefined;
			}
		}
		
		/**
		 * Converts the user input to valid evaluable Javascript.
		 * 
		 * Taken from the ASCII Math Calculator project.
		 */
		var mathjs = function(st) {
            st = st.replace(/\s/g,"");
            if (st.indexOf("^-1")!=-1) {
                st = st.replace(/sec\^-1/g,"Math.arcsec");
                st = st.replace(/csc\^-1/g,"Math.arccsc");
                st = st.replace(/cot\^-1/g,"Math.arccot");
                st = st.replace(/sinh\^-1/g,"Math.arcsinh");
                st = st.replace(/cosh\^-1/g,"Math.arccosh");
                st = st.replace(/tanh\^-1/g,"Math.arctanh");
                st = st.replace(/sech\^-1/g,"Math.arcsech");
                st = st.replace(/csch\^-1/g,"Math.arccsch");
                st = st.replace(/coth\^-1/g,"Math.arccoth");
            }
            st = st.replace(/pi/g,"Math.PI");
            //st = st.replace(/([^a-zA-Z])e([^a-zA-Z])/g,"$1(Math.E)$2");
            st = st.replace(/([0-9])([\(a-zA-Z])/g,"$1*$2");
            st = st.replace(/\)([\(0-9a-zA-Z])/g,"\)*$1");
                
            var i,j,k, ch, nested;
            while ((i=st.indexOf("^"))!=-1) {
                //find left argument
                if (i==0) return "Error: missing argument";
                j = i-1;
                ch = st.charAt(j);
                if (ch>="0" && ch<="9") {// look for (decimal) number
                    j--;
                    while (j>=0 && (ch=st.charAt(j))>="0" && ch<="9") j--;
                    if (ch==".") {
                        j--;
                        while (j>=0 && (ch=st.charAt(j))>="0" && ch<="9") j--;
                    }
                } else if (ch==")") {// look for matching opening bracket and function name
                    nested = 1;
                    j--;
                    while (j>=0 && nested>0) {
                        ch = st.charAt(j);
                        if (ch=="(") nested--;
                        else if (ch==")") nested++;
                        j--;
                    }
                    while (j>=0 && (ch=st.charAt(j))>="a" && ch<="z" || ch>="A" && ch<="Z") j--;
                } else if (ch>="a" && ch<="z" || ch>="A" && ch<="Z") {// look for variable
                    j--;
                    while (j>=0 && (ch=st.charAt(j))>="a" && ch<="z" || ch>="A" && ch<="Z") j--;
                } else { 
                    return "Error: incorrect syntax in " + st + " at position "+j;
                }
                //find right argument
                if (i==st.length-1) return "Error: missing argument";
                k = i+1;
                ch = st.charAt(k);
                if (ch>="0" && ch<="9" || ch=="-") {// look for signed (decimal) number
                    k++;
                    while (k<st.length && (ch=st.charAt(k))>="0" && ch<="9") k++;
                    if (ch==".") {
                        k++;
                        while (k<st.length && (ch=st.charAt(k))>="0" && ch<="9") k++;
                    }
                } else if (ch=="(") {// look for matching closing bracket and function name
                    nested = 1;
                    k++;
                    while (k<st.length && nested>0) {
                        ch = st.charAt(k);
                        if (ch=="(") nested++;
                        else if (ch==")") nested--;
                        k++;
                    }
                } else if (ch>="a" && ch<="z" || ch>="A" && ch<="Z") {// look for variable
                    k++;
                    while (k<st.length && (ch=st.charAt(k))>="a" && ch<="z" || ch>="A" && ch<="Z") k++;
                } else { 
                    return "Error: incorrect syntax in "+st+" at position "+k;
                }
                st = st.slice(0,j+1)+"Math.pow("+st.slice(j+1,i)+","+st.slice(i+1,k)+")"+
                st.slice(k);
            }
            while ((i = st.indexOf("!"))!=-1) {
                //find left argument
                if (i == 0) return "Error: missing argument";
                j = i - 1;
                ch = st.charAt(j);
                if (ch >= "0" && ch <= "9") {// look for (decimal) number
                    j--;
                    while (j >= 0 && (ch = st.charAt(j)) >= "0" && ch <= "9") j--;
                    if (ch == ".") {
                        j--;
                        while (j >= 0 && (ch = st.charAt(j)) >= "0" && ch <= "9") j--;
                    }
                } else if (ch == ")") {// look for matching opening bracket and function name
                    nested = 1;
                    j--;
                    while (j >= 0 && nested > 0) {
                        ch = st.charAt(j);
                        if (ch == "(") nested--;
                        else if (ch == ")") nested++;
                        j--;
                    }
                    while (j >= 0 && (ch = st.charAt(j)) >= "a" && ch <= "z" || ch >= "A" && ch <= "Z") j--;
                } else if (ch >= "a" && ch<="z" || ch>="A" && ch<="Z") {// look for variable
                    j--;
                    while (j>=0 && (ch=st.charAt(j))>="a" && ch<="z" || ch>="A" && ch<="Z") j--;
                } else { 
                    return "Error: incorrect syntax in "+st+" at position "+j;
                }
                st = st.slice(0,j+1)+"Math.factorial("+st.slice(j+1,i)+")"+st.slice(i+1);
            }
            return st;
		}
		
		/**
		 * Converts the given Latex expression to a Javascript expression.
		 * 
		 * expression : Expression to be interpreted.
		 **/	
		var latexeval = function(place, expression, parseOnly) {
			// Simple evaluator for math expressions. Converts LaTeX expression (without variables) to Javascript expression
			// and tries to evaluate it to a number.
			expression = '' + expression;
			
			var randomName = 'r' + Math.ceil(Math.random() * 10000000);
			Math[randomName] = place;
			// Functions that can be nested, should be replaced repeatedly from innermost to the outermost.
			var latexrep = [
				[/((?:[\-+]?[0-9]+)|(?:\\left\([^\(\)]+\\right\)))!/ig, 'factorial($1)'],
				[/\\sqrt{([^{}]+)}/ig, 'sqrt($1)'],
				[/\\frac{([^{}]+)}{([^{}]+)}/ig, '(($1)/($2))'],
				[/\\left\|([^\|]*)\\right\|/g, 'abs($1)'],
				[/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\^((?:[\-+]?[0-9\.]+)|(?:{[^{}]+}))/ig, 'pow($1, $2)'],
				
                [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u2070/ig, 'pow($1, 0)'],
                [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u00B9/ig, 'pow($1, 1)'],
                [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u00B2/ig, 'pow($1, 2)'],
                [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u00B3/ig, 'pow($1, 3)'],
                [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u2074/ig, 'pow($1, 4)'],
                [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u2075/ig, 'pow($1, 5)'],
                [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u2076/ig, 'pow($1, 6)'],
                [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u2077/ig, 'pow($1, 7)'],
                [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u2078/ig, 'pow($1, 8)'],
                [/((?:[\-+]?[0-9\.]+|\\pi|\\exp1)|(?:\\left\([^\(\)]+\\right\)))\u2079/ig, 'pow($1, 9)']
			];
			
			// Some LaTeX-markings need to be replaced only once.
			var reponce = [
				[/\\sin\^{-1}|\\arcsin|\\asin/ig, 'asin'],	// Replace arcsin
				[/\\cos\^{-1}|\\arccos|\\acos/ig, 'acos'],	// Replace arccos
				[/\\tan\^{-1}|\\arctan|\\atan/ig, 'atan'],	// Replace arctan
				//[/(?:\\inp|inp|\\text{inp})\\left\(([0-9]+)\\right\)/ig, 'inp($1, ' + randomName + ')'],			// Replace ans
				[/(?:\\ans|ans|\\text{ans})\\left\(([0-9]+)\\right\)/ig, 'ans($1, ' + randomName + ')'],			// Replace ans
				[/\\sin/ig, 'sin'],			// Replace sin
				[/\\cos/ig, 'cos'],			// Replace cos
				[/\\tan/ig, 'tan'],			// Replace tan
				[/\\ln/ig, 'log'],			// Replace ln
				[/\\log/ig, 'logTen'],		// Replace log
				[/\\pi/ig, 'PI'],			// Replace PI
				[/\\left\(/ig, '('],		// Replace left parenthesis )
				[/\\right\)/ig, ')'],		// Replace right parenthesis
				[/(sin|cos|tan)\(([^\^\)]+)\^{\\circ}/ig, '$1($2*PI/180'],  // Replace degrees with radians inside sin, cos and tan 
				[/{/ig, '('],				// Replace left bracket
				[/}/ig, ')'],				// Replace right bracket
				[/\)\(/ig, ')*('],			// Add times between ending and starting parenthesis )
				[/\\cdot/ig, '*'],			// Replace cdot with times
				[/\\exp1/ig, 'exp(1)'],			// Replace Neper's number
				//[/([0-9]+)PI/ig, '$1*PI']
			]
			var oldexpr = '';
			
			/*
			 * Commas should be replaced from the original input before
			 * any of the power functions (or other functions containing
			 * commas as separators) are replaced.
			 */
			expression = expression.replace(/,/ig, '.');
			expression = expression.replace(/\\mathrm{e}|\\e|\\text{e}/ig, '\\exp1');
			
			while (oldexpr !== expression) {
				// Replace strings as long as the expression keeps changing.
				oldexpr = expression;
				for (var i = 0; i < latexrep.length; i++){
					expression = expression.replace(latexrep[i][0], latexrep[i][1]);
				}
			}
			for (var i = 0; i < reponce.length; i++){
				expression = expression.replace(reponce[i][0], reponce[i][1]);
			}
			
			var reg = /(?:[a-z$_][a-z0-9$_]*)|(?:[;={}\[\]"'!&<>^\\?:])/ig;
			var valid = true;
			expression = expression.replace(reg, function(word){
				if (Math.hasOwnProperty(word)) {
                    
					return 'Math.' + word;
				} else if (
					(word.toLowerCase() == 'x') ||
					(word.toLowerCase() == 'y') ||
					(word.toLowerCase() == 'z') ||
					(word.toLowerCase() == 't')
				) return word;
				else {
					valid = false;
					return word;
				}
			});
			if (!valid){
				throw 'Invalidexpression1';
			} else {
				try {
					expression = mathjs(expression);
					if (parseOnly) return expression;
					
					var s = (new Function('return ('+expression+')'))();
					delete Math[randomName];
					return s;
				} catch (err) {
					throw 'Invalidexpression2';
				}
			}
		}
			
		/**
		 * Splits the output into lines, processes the output using eval and
		 * returns the result in element defined by the output ID.
		 * 
		 * Derived from the ASCII Math Calculator project.
		 **/
		var calculate = function(place, inputId, outputId) {
			var str = pruneStr(place.find('#' + inputId).mathquill('latex'));
			var err = "";
			var str2 = str;
			try {
				var res = latexeval(place, str2);
			} catch(e) {
				err = "syntax incomplete";
			}
			
			if (!isNaN(res) && res!="Infinity") 
				str2 = (Math.abs(res-Math.round(res*1000000)/1000000)<1e-15?Math.round(res*1000000)/1000000:res)+err; 
			else if ( res == "Infinity" ) str2 = '\\text{Big enough to be numerically } \\infty \\text{.}';
            else if (str2!='') str2 = "undefined";	
			
			place.find('#' + outputId).mathquill('revert').empty().html(str2).mathquill();
		}

		var pruneStr = function(str) {
            return( str
                .replace(/\\:/ig, '')
            );
        }
		
		var copyToCurrent = function(place, from) {
            var str = from.mathquill('latex');
            var str = str.replace(/\\:/ig, '').replace(/\²/ig, '^2');
			place.find('#in').mathquill('write', str).focus();
		}

		/**
		 * Inserts the given string to the input's cursor location.
		 * 
		 * st: String-to-be-inserted.
		 * diff: Cursor movement after insertion. Positive goes right and
		 * negative to left.
		 */
		var insert = function(place, st, diff){
			if (st == "@enterkey") {
				
				// Check that input isn't empty.
				var elemIn = place.find('span#in');
				if (pruneStr(elemIn.mathquill('latex')) != '') {
					
					calculate(place, 'in', 'out');
					var elemOut = place.find('span#out');
					var idNum = place.find('div.inOld').length;
					var ansCount = place.data('ansCount');
					
					place.find('div#inCurrent').before('<div class="inOld">' + /*'<span class="lineId">inp(' + ansCount + ') := </span>' + */'<span  id="in-' + idNum + '" class=\"mathquill-embedded-latex\">' + pruneStr(elemIn.mathquill('latex')) + '</span></div>');
					place.find('div#inCurrent').before('<div class="outOld"><span class="lineId">ans(' + ansCount + ') := </span><span  id="out-' + idNum + '">' + pruneStr(elemOut.mathquill('latex')) + '</span></div>');

					clearInput(place, false);
					
					place.find('span#in-' + idNum).mathquill().click(function() { copyToCurrent(place, $(this)); });
					place.find('span#out-' + idNum).mathquill().click(function() { copyToCurrent(place, $(this)); });
					
					place.data('inp-' + ansCount, pruneStr(place.find('span#in-' + idNum).mathquill('latex')));	
					place.data('ans-' + ansCount, pruneStr(place.find('span#out-' + idNum).mathquill('latex')));	
					place.data('ansCount', ++ansCount);	
				}	
			}
			else {
				
				{
					// Get cursor for the input element.
					var $math_box = place.find('#in');
					var data = $math_box.data('[[mathquill internal data]]');
					var block = data && data.block;
					var cursor = block && block.cursor;
                   
					var latex = cursor.selection ? cursor.selection.latex() : '';
					
					// The suffix notation cases.
					if (st == '\\frac{%1}{}') {
						if (latex == '' && cursor.prev) latex = cursor.prev.latex();
						cursor.backspace();
					} else {
						if (latex != '') {
							if ((st == '%1!') || (st == '%1^2') || (st == '%1^'))
								latex = '\\left(' + latex + '\\right)';
							diff = (st == '%1^') ? -1 : 0;
						}
					}
					if (st.length === 1) {
                        cursor.write(st);
                        place.find('#in').focus();
                    }
                    else place.find('#in').mathquill('write', st.replace('%1', latex)).focus();
					
					// Move the cursor if needed.
					if (diff != 0){
						if (diff < 0) for (var i = 0; i < -1 * diff; i++) cursor.moveLeft();
						else for (var j = 0; i < diff; i++) cursor.moveRight();
					}
				}
				calculate(place, 'in','out');
			}
			if (typeof(place.find(".inputDisplay").prop) === "undefined") // .prop() doesn't exist in this version of jQuery.
				place.find(".inputDisplay").animate({ scrollTop: place.find(".inputDisplay").attr("scrollHeight") }, 100);
			else
				place.find(".inputDisplay").animate({ scrollTop: place.find(".inputDisplay").prop("scrollHeight") }, 100);
		}

		/**
		 * Added by Rolf Lindén 20121120.1659
		 */
		var keyUpFunction = function(place) {
			calculate(place, 'in','out');
		}

		/**
		 * Clears the input field.
		 **/
		var clearInput = function(place, allowAll){
			if ((pruneStr(place.find('#in').mathquill('latex')) == '') && (allowAll)) {
				place.find('.inOld, .outOld').remove();
			} else {
				place.find('#out').mathquill('latex', '');
				place.find('#in').mathquill('latex', '').focus();
			}
		}

		/**
		 * Initialization function.
		 **/
		var init = function (place, params){
			// Checks if editor's CSS information is already written to document's head.
			if ($('head style#calculatorstyle').length == 0){
                $('head').append('<style id="calculatorstyle" type="text/css">' + sCSS + '</style>');
            }
			
			/*
			 * Layout of the calculator.
			 * Loosely based on the calculator template from ASCII Math Calculator project.
			 */
			var calcstr =
				"<div class=\"inputDisplay\">" +
				"<div class=\"calcInput\" id=\"inCurrent\"><span id=\"in\"></span></div>" +
				"<div class=\"calcResult\" id=\"outCurrent\"><span id=\"out\"></span></div>" + 
				"</div>" +
				"<button id=\"piBtn\" class=\"gray calcBtn \">&pi;</button>" +
				"<button id=\"arcsinBtn\" class=\"gray calcBtn\">sin<sup>-1</sup></button>" +
				"<button id=\"arccosBtn\" class=\"gray calcBtn\">cos<sup>-1</sup></button>" +
				"<button id=\"arctanBtn\" class=\"gray calcBtn\">tan<sup>-1</sup></button>" +
				"<button id=\"clearBtn\" class=\"red calcBtn clearBtn\">C/CE </button><br/>" +
				"<button id=\"expBtn\" class=\"gray calcBtn\">e</button>" +
				"<button id=\"sinBtn\" class=\"gray calcBtn\">sin</button>" +
				"<button id=\"cosBtn\" class=\"gray calcBtn\">cos</button>" +
				"<button id=\"tanBtn\" class=\"gray calcBtn\">tan</button>" +
				"<button id=\"divBtn\" class=\"gray calcBtn\">&#247;</button><br/>" +
				"<button id=\"lnBtn\" class=\"gray calcBtn\">ln</button>" +
				"<button id=\"logBtn\" class=\"gray calcBtn\">log</button>" +
				"<button id=\"leftParenBtn\" class=\"gray calcBtn\">( )</button>" +
				"<button id=\"absBtn\" class=\"gray calcBtn\">| |</button>" +
				"<button id=\"prodBtn\" class=\"gray calcBtn\">&#10799;</button><br/>" +
				"<button id=\"powBtn\" class=\"gray calcBtn\">x<sup>y</sup></button>" +
				"<button id=\"b7\" class=\"white calcBtn calcNumberBtn\">7</button>" +
				"<button id=\"b8\" class=\"white calcBtn calcNumberBtn\">8</button>" +
				"<button id=\"b9\" class=\"white calcBtn calcNumberBtn\">9</button>" +
				"<button id=\"subBtn\" class=\"gray calcBtn\">&#8722;</button><br/>" +
				"<button id=\"quadBtn\" class=\"gray calcBtn\">x<sup>2</sup></button>" +
				"<button id=\"b4\" class=\"white calcBtn calcNumberBtn\">4</button>" +
				"<button id=\"b5\" class=\"white calcBtn calcNumberBtn\">5</button>" +
				"<button id=\"b6\" class=\"white calcBtn calcNumberBtn\">6</button>" +
				"<button id=\"addBtn\" class=\"gray calcBtn\">+</button><br/>" +
				"<button id=\"sqrtBtn\" class=\"gray calcBtn sqrtBtn\">&#8730;&#175;</button>" +
				"<button id=\"b1\" class=\"white calcBtn calcNumberBtn\">1</button>" +
				"<button id=\"b2\" class=\"white calcBtn calcNumberBtn\">2</button>" +
				"<button id=\"b3\" class=\"white calcBtn calcNumberBtn\">3</button>" +
				"<button id=\"enterBtn\" class=\"gray calcBtn SEcorner green enterBtn\">&#9166;</button><br />" +
				"<button id=\"factorialBtn\" class=\"gray calcBtn SWcorner\">n!</button>" +
				"<button id=\"b0\" class=\"white calcBtn calcNumberBtn\">0</button>" +
				"<button id=\"decimalBtn\" class=\"gray calcBtn\">,</button>" +
				"<button id=\"ansBtn\" class=\"gray calcBtn\">Ans</button>";
			
			var $this = $(place).addClass('calculator').html(calcstr);
			
			{ // Click handlers.
				$this.find('button#piBtn').click(function()        { insert($this, '\\pi', 0); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#expBtn').click(function()       { insert($this, '\\e', 0); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#clearBtn').click(function()     { clearInput($this, true); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#powBtn').click(function()       { insert($this, '^', 0/*'%1^', -1*/); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#quadBtn').click(function()      { insert($this, '%1^2', 0); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); })
				$this.find('button#decimalBtn').click(function()   { insert($this, '.', 0); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#enterBtn').click(function()     { insert($this, '@enterkey', 0); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#addBtn').click(function()       { insert($this, '+', 0); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#subBtn').click(function()       { insert($this, '-', 0); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#divBtn').click(function()       { insert($this, '/', 0/*'\\frac{%1}{}', -1*/); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#sqrtBtn').click(function()      { insert($this, '\\sqrt{%1}', -1); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#logBtn').click(function()       { insert($this, '\\log\\left(%1', -1); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#ansBtn').click(function()       { insert($this, '\\ans\\left(%1', -1); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#lnBtn').click(function()        { insert($this, '\\ln\\left(%1', -1); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#arcsinBtn').click(function()    { insert($this, '\\sin^{-1}\\left(%1', -1); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#arccosBtn').click(function()    { insert($this, '\\cos^{-1}\\left(%1', -1); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#arctanBtn').click(function()    { insert($this, '\\tan^{-1}\\left(%1', -1); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#sinBtn').click(function()       { insert($this, '\\sin\\left(%1', -1); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#cosBtn').click(function()       { insert($this, '\\cos\\left(%1', -1); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#tanBtn').click(function()       { insert($this, '\\tan\\left(%1', -1); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#prodBtn').click(function()      { insert($this, '*', 0); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#leftParenBtn').click(function() { insert($this, '(', 0); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#absBtn').click(function()       { insert($this, '|', 0); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#factorialBtn').click(function() { insert($this, '!', 0); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
               
				$this.find('button#b0').click(function() { insert($this, '0', 0); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#b1').click(function() { insert($this, '1', 0); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#b2').click(function() { insert($this, '2', 0); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#b3').click(function() { insert($this, '3', 0); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#b4').click(function() { insert($this, '4', 0); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#b5').click(function() { insert($this, '5', 0); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#b6').click(function() { insert($this, '6', 0); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#b7').click(function() { insert($this, '7', 0); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#b8').click(function() { insert($this, '8', 0); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
				$this.find('button#b9').click(function() { insert($this, '9', 0); $this.trigger('calculator_press', $.extend({ senderID: $this.attr('id'), buttonID : this.id }, $(this).parent().data('params')) ); });
			}
			{ // Key bindings.
                $this.find('button').keypress(
                    function(e) {
                        var c = String.fromCharCode(e.which);
                        switch (c) {
                            case '0' : $this.find('button#b0').click(); break;
                            case '1' : $this.find('button#b1').click(); break;
                            case '2' : $this.find('button#b2').click(); break;
                            case '3' : $this.find('button#b3').click(); break;
                            case '4' : $this.find('button#b4').click(); break;
                            case '5' : $this.find('button#b5').click(); break;
                            case '6' : $this.find('button#b6').click(); break;
                            case '7' : $this.find('button#b7').click(); break;
                            case '8' : $this.find('button#b8').click(); break;
                            case '9' : $this.find('button#b9').click(); break;
                            case 'e' : $this.find('button#expBtn').click(); break;
                            case '²' : $this.find('button#quadBtn').click(); break;
                            case '/' : $this.find('button#divBtn').click(); break;
                            case 'c' : $this.find('button#clearBtn').click(); break;
                            case ',' : $this.find('button#decimalBtn').click(); break;
                            case '*' : $this.find('button#prodBtn').click(); break;
                            case '-' : $this.find('button#subBtn').click(); break;
                            case '+' : $this.find('button#addBtn').click(); break;
                            case '(' : $this.find('button#leftParenBtn').click(); break;
                            case '|' : $this.find('button#absBtn').click(); break;
                            case '!' : $this.find('button#factorialBtn').click(); break;
                        }
                    }
                )
                .keydown(
                    function(e) {
                        var $math_box = place.find('#in');
                        var data = $math_box.data('[[mathquill internal data]]');
                        var block = data && data.block;
                        var cursor = block && block.cursor;
                        
                        e.ctrlKey = e.ctrlKey || e.metaKey;
                        switch ((e.originalEvent && e.originalEvent.keyIdentifier) || e.which) {
                            case 8: //backspace
                            case 'Backspace':
                            case 'U+0008':
                                if (e.ctrlKey)
                                while (cursor.prev || cursor.selection)
                                    cursor.backspace();
                                else
                                cursor.backspace();
                                break;
                        }
                    }
                );
            }
			
			$this.data('ansCount', 0);
			$this.data('buttonIDs', params.buttonIDs);
			$this.find('span#in').mathquill(params.editable ? "editable" : undefined).focus().keyup(function(e) {
				if (e.keyCode == '13' && !(e.shiftKey || e.ctrlKey || e.altKey))
					$this.find('button#enterBtn').click();
				else keyUpFunction($this);
			});
			
			// Announce existence.
			var announced = { senderID: $this.attr('id'), fnName: 'calculator' };
			$this.trigger('announce', announced);
		}
	}
	{ /** jQuery Plugin interface    **/
		var methods = {
			'init' : function(params) {
				// call handler.
				params = $.extend( {
					editable: true, // By default, the current line is editable.
					buttonIDs: [
						'piBtn', 'expBtn', 'clearBtn', 'powBtn', 'quadBtn',
						'decimalBtn', 'enterBtn', 'addBtn', 'subBtn', 'divBtn',
						'sqrtBtn', 'logBtn', 'ansBtn', 'lnBtn', 'arcsinBtn',
						'arcCosBtn', 'arctanBtn', 'sinBtn', 'cosBtn', 'tanBtn',
						'prodBtn', 'leftParenBtn', 'absBtn', 'factorialBtn',
						'b0', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9'
					],
				}, params);
				
				return this.each( function() {
					init($(this), params);
				});
			},
			'parse' : function(params) {
				return latexeval($(this), params, true);
			},
			'calculate' : function(params) {
				return latexeval($(this), params, false);
			},
			'attachables' : function(params) {
				return [
					{
						'eventType' : 'calculator_press',
						'action' : 'press'
					}
				];
			},
			'unittest' : function(params) {
				tests = [
					{ method: 'calculate', clause: '5!', check: function(ans) { return ans == '120'; }},
					{ method: 'calculate', clause: '1+1', check: function(ans) { return ans == '2'; }},
					{ method: 'calculate', clause: '1+2+3', check: function(ans) { return ans == '6'; }},
					{ method: 'calculate', clause: '\\left|-8\\right|', check: function(ans) { return ans == '8'; }},
					{ method: 'calculate', clause: '1-(3*4)', check: function(ans) { return ans == '-11'; }},
					{ method: 'calculate', clause: '\\frac{8}{12}', check: function(ans) { return Math.abs(0.66666666 - ans) < 0.00001; }},
					{ method: 'calculate', clause: '2^2^2', check: function(ans) { return ans == '16'; }},
					{ method: 'calculate', clause: '\\sin\\left(\\pi\\right)', check: function(ans) { return Math.abs(0 - ans) < 0.00001; }},
					{ method: 'calculate', clause: '\\sin\\left(\\arccos\\left( 1 \\right)\\right)', check: function(ans) { return Math.abs(0 - ans) < 0.00001; }},
				];
				
				var total = 0;
				var passed = 0;
				for (i in tests) {
					var result = methods[tests[i].method](tests[i].clause);
					var outcome = (result == 'Invalidexpression' ? false : tests[i].check(result));
					if (!outcome) console.error('Unit test failed for "' + tests[i].clause + '":\n\tGot "' + result + '".')
					passed += outcome;
					++total;
				}
				if (passed == total) {
					return true;
				} else {
					return false;
				}
			},
			'press' : function(params) {
				return this.each( function() {
					var buttonIDs = $(this).data('buttonIDs');
					if (buttonIDs.indexOf(params.buttonID) >= 0) {
						$(this).data('params', params);
						$(this).find('button#' + params.buttonID).click();
						$(this).removeData('params');
					}
					else console.error('Calculator: Invalid button ID "' + params.buttonID + '".');
				});
			}
		}
		
		$.fn.calculator = function( method ) {
			 
			if ( methods[method] ) {
				return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
			} else if ( typeof method === 'object' || ! method ) {
				return methods.init.apply( this, arguments );
			} else {
				$.error( 'Method ' +  method + ' does not exist on jQuery.calculator' );
				return false;
			}
		}
	}
})(jQuery)

//}}}

//{{{
	
// Added so it can be used without TiddlyWiki.
if (typeof config == 'undefined') {
	var config = new Object();
	config.macros = new Object();
}
			
config.macros.calculator = {
    /******************************
    * Show calculator
    ******************************/
    handler: function (place, macroName, params, wikifier, paramString, tiddler)
    {
        
        var calculatordiv = '{{calculator{\n}}}';
        wikify(calculatordiv, place, null, tiddler);

        jQuery(place).find('.calculator').last().calculator('init');
    }
}

//}}}
