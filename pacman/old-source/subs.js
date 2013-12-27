/* Contents:
  I.   Sub Functions
  II.  Events Functions
  III. Elements Functions
*/


/* ------------------
    Sub Functions  */

var subs = {

   // Animation
   requestAnimation: function (callback){
      var f = window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.msRequestAnimationFrame     || 
              window.oRequestAnimationFrame      || 
              function (callback, element){
                 window.setTimeout(callback, 1000 / 60);
              };
       return f(callback);
    },
    cancelAnimation: function (id){
       var f = window.cancelRequestAnimationFrame       || 
               window.webkitCancelRequestAnimationFrame || 
               window.mozCancelRequestAnimationFrame    || 
               window.msCancelRequestAnimationFrame     || 
               window.oCancelRequestAnimationFrame      || 
               function (id){ clearTimeout(id); };
       return f(id);
    },
    
       
   // Supports
   supportsStorage: function (){
      return ('localStorage' in window) && window['localStorage'] !== null;
   },
   supportsAudio: function (){
      return !!document.createElement('audio').canPlayType;
   },
   
   
   // Browsers
   isIE: function (){
      return !!(window.attachEvent && !window.opera);
   },
   isFF: function (){
      return navigator.userAgent.indexOf('Firefox/') != -1;
   },
   isChrome: function (){
      return navigator.userAgent.indexOf('Chrome/') != -1;
   },
   isSafari: function (){
      return navigator.userAgent.indexOf('Safari/') != -1;
   },
   isOpera: function (){
      return !!window.opera;
   },
   
   
   // Search a text in another text
   inText: function (what, where){
      return what && where && where.toLowerCase().indexOf(what.toLowerCase()) != -1;
   },
   
   // Check if is an Object
   isObject: function (x){
      return (x !== null && typeof(x) == 'object');
   },
	

   // PHP is_numeric() function
   isNumeric: function (string){
      if (!string) return true;
      
      var validChars = '0123456789.,-';
      var isNumber = true;
      
      for (var i = 0; i < string.length && isNumber == true; i++){ 
         var char = string.charAt(i); 
         if (validChars.indexOf(char) == -1)
            isNumber = false;
      }
      return isNumber;
   },
   
   // PHP is_array() function
   isArray: function (input){
      return input && typeof(input) == 'object' && (input instanceof Array);
   },
   
   // PHP in_array() function
   inArray: function (string, array){
      for (var i = 0; i < array.length; i++)
         if (String(string).localeCompare(String(array[i])) == 0)
            return true;
      return false;
   },
   
   // PHP rand() function
   rand: function (maxim){ 
      return Math.floor(Math.random() * maxim + 1);
   },
   rand2: function (minim, maxim){ 
      return minim + Math.floor(Math.random() * (maxim - minim) + 1);
   },
   
   // PHP trim() function
   trim: function (string){
      return string.replace(/^\s+|\s+$/g, '');
   },
   
   // PHP strip_html() function
   strip: function (string) {
      return string.replace(/<\/?[^>]+(>|$)/g, '');
   },
	
	// PHP ucfirst() function
   ucfirst: function (string){
      return string.charAt(0).toUpperCase() + string.slice(1);
   }
}



/* ---------------------
    Events Functions  */

var subsEvents = {
   
   // Creates an Events
   add: function (type, fn, obj){
      if (!obj) obj = document;
      
      if (obj.attachEvent){
         obj['e'+type+fn] = fn;
         obj[type+fn] = function(){ obj['e'+type+fn](window.event); }
         obj.attachEvent('on'+type, obj[type+fn]);
      }
      else
         obj.addEventListener(type, fn, false);
   },
   
   
   // Destroys an Event
   remove: function (type, fn, obj){
      if (!obj) obj = document;
      
      if (obj.detachEvent){
         obj.detachEvent('on'+type, obj[type+fn]);
         obj[type+fn] = null;
      }
      else
         obj.removeEventListener(type, fn, false);
   },
      
   
   // Returns the key pressed
   getKey: function (evnt){
      return window.event ? event.keyCode : evnt.keyCode;
   },
   
   
   // Get the Mouse Position
   getMousePos: function (evnt, correctValues){
      var posTop = 0, posLeft = 0;
      
      if (!evnt) var evnt = window.event;
      if (evnt.pageX){
         posTop  = evnt.pageY;
         posLeft = evnt.pageX;
      }
      else if (evnt.clientX){
         posTop  = evnt.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
         posLeft = evnt.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
      }
      if (correctValues){
         posTop  -= (sys.ff ? 16 : 12);
         posLeft -= (sys.ff ? 16 : 12);
      }
      return { top: posTop, left: posLeft }
   }
}



/* -----------------------
    Elements Functions  */

var subsElements = {
   
   // Add/Remove element's classes
   addClass: function (element, eclass){
      element = this.getElement(element);
      if (!element) return;
      
      element.className = element.className +' '+ eclass;
   },
   
   removeClass: function (element, eclass){
      element = this.getElement(element);
      if (!element) return;
      
      var classes = element.className.split(' ');
      var result = [], j = 0;
      
      for (var i = 0; i < classes.length; i++){
         classes[i] = subs.trim(classes[i]);
         if (!classes[i] || classes[i] == eclass)
            continue;
         result[j++] = classes[i];
      }
      element.className = result.join(' ');
   },
   
   hasClass: function (element, eclass){
      element = this.getElement(element);
      if (!element) return false;
      
      return element.className.indexOf(eclass) > -1;
   },
   
   
   // Get an Element by Id if is a string
   getElement: function (element){
      return element && typeof(element) == 'string' ? document.getElementById(element) : element;
   },
   
   // Get Elements or Element by its Class
   getElementsByClassName: function (eclass, container, type){
      container = container && this.getElement(container) ? this.getElement(container) : document;
      type      = type ? type : 'div';
      
      var elements = container.getElementsByTagName(type), list = [], j = 0;
      for (var i = 0; i < elements.length; i++){
         if (elements[i].className && elements[i].className.indexOf(eclass) > -1) 
            list[j++] = elements[i];
      }
      return list;
   },
   
      
   // Returns the Style value as a float
   getStyleNum: function (element, style){
      element = this.getElement(element);
      if (!element) return;
      
      var value = parseFloat(element.style[style]);
      return isNaN(value) ? null : value;
   },
   
   
   // Get an Element Postion
   getPosition: function (element){
      element = this.getElement(element);
      if (!element) return { top: 0, left: 0 };
      
      var posTop = 0, posLeft = 0;
      if (typeof(element.offsetParent) != 'undefined'){
         posTop  = element.offsetTop;
         posLeft = element.offsetLeft;
         
         while (element.offsetParent && typeof(element.offsetParent) == 'object'){
            element = element.offsetParent;
            posTop  += element.offsetTop;
            posLeft += element.offsetLeft;
         }
      }
      else if (typeof(element.x) != 'undefined'){
         posTop  = element.y;
         posLeft = element.x;
      }
      return { top: posTop, left: posLeft }
   },
   
   
   // InnerHTML
   setContent: function (element, content){
      element = this.getElement(element);
      if (!element) return;
      
      element.innerHTML = content;
   },
      
   
   // Set the opacity of an element
   setOpacity: function (element, opacity){
      element = this.getElement(element);
      if (!element) return;
      
      element.style.opacity    = opacity;
      element.style.MozOpacity = opacity;
      element.style.filter     = 'alpha(opacity=' + (opacity * 100) + ')';
   },
   
   
   // Remove Element
   removeElement: function (element){
      element = this.getElement(element);
      if (!element) return;

      var parent = element.parentNode;
      parent.removeChild(element);
   }
}