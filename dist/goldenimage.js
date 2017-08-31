(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["goldenimage"] = factory();
	else
		root["goldenimage"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var getOrientation = function getOrientation(file, callback) {
	  var reader = new FileReader();
	  reader.onload = function (e) {
	
	    var view = new DataView(e.target.result);
	    if (view.getUint16(0, false) != 0xFFD8) return callback(-2);
	    var length = view.byteLength,
	        offset = 2;
	    while (offset < length) {
	      var marker = view.getUint16(offset, false);
	      offset += 2;
	      if (marker == 0xFFE1) {
	        if (view.getUint32(offset += 2, false) != 0x45786966) return callback(-1);
	        var little = view.getUint16(offset += 6, false) == 0x4949;
	        offset += view.getUint32(offset + 4, little);
	        var tags = view.getUint16(offset, little);
	        offset += 2;
	        for (var i = 0; i < tags; i++) {
	          if (view.getUint16(offset + i * 12, little) == 0x0112) return callback(view.getUint16(offset + i * 12 + 8, little));
	        }
	      } else if ((marker & 0xFF00) != 0xFF00) break;else offset += view.getUint16(offset, false);
	    }
	    return callback(-1);
	  };
	  reader.readAsArrayBuffer(file);
	};
	
	var loadImage = function loadImage(f) {
	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	  var callback = arguments[2];
	
	  getOrientation(f, function (srcOrientation) {
	    var reader = new FileReader();
	    reader.addEventListener('load', function (file) {
	      var img = new Image();
	      img.onload = function () {
	        var width = img.width;
	        var height = img.height;
	        var canvas = document.createElement('canvas');
	        var ctx = canvas.getContext('2d');
	
	        if ([5, 6, 7, 8].indexOf(srcOrientation) > -1) {
	          canvas.width = height;
	          canvas.height = width;
	        } else {
	          canvas.width = width;
	          canvas.height = height;
	        }
	        var preferedWidth = options.width || canvas.width;
	        var outputCompression = options.compression || 0.7;
	        var outputType = null;
	        if (options.compression) {
	          outputType = 'image/jpeg';
	        }
	
	        switch (srcOrientation) {
	          case 2:
	            ctx.transform(-1, 0, 0, 1, width, 0);break;
	          case 3:
	            ctx.transform(-1, 0, 0, -1, width, height);break;
	          case 4:
	            ctx.transform(1, 0, 0, -1, 0, height);break;
	          case 5:
	            ctx.transform(0, 1, 1, 0, 0, 0);break;
	          case 6:
	            ctx.transform(0, 1, -1, 0, height, 0);break;
	          case 7:
	            ctx.transform(0, -1, -1, 0, height, width);break;
	          case 8:
	            ctx.transform(0, -1, 1, 0, 0, width);break;
	          default:
	            ctx.transform(1, 0, 0, 1, 0, 0);
	        }
	
	        ctx.drawImage(img, 0, 0);
	        var src = canvas.toDataURL(outputType, outputCompression);
	
	        // Resizing
	        var img2 = new Image();
	        img2.src = src;
	        img2.onload = function () {
	          var ratio = preferedWidth / canvas.width;
	          canvas.width = preferedWidth;
	          canvas.height = canvas.height * ratio;
	          ctx.drawImage(img2, 0, 0, canvas.width, canvas.height);
	          callback(canvas.toDataURL(outputType, outputCompression));
	        };
	      };
	      img.src = file.target.result;
	    }, false);
	    reader.readAsDataURL(f);
	  });
	};
	
	exports.default = loadImage;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=goldenimage.js.map