var sbSelect =
/******/ (function(modules) { // webpackBootstrap
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
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	// const _defaults = require('lodash.defaults');
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var dom = __webpack_require__(1);
	
	var KEYS = {
	  UP: 38,
	  DOWN: 40,
	  SPACE: 32,
	  RETURN: 13,
	  TAB: 9
	};
	
	var SbSelect = function () {
	  function SbSelect(originalSelect) {
	    _classCallCheck(this, SbSelect);
	
	    this.originalSelect = originalSelect;
	    this.createElements();
	    this.addListeners();
	  }
	
	  _createClass(SbSelect, [{
	    key: 'createElements',
	    value: function createElements(originalSelect) {
	      this.wrapper = document.createElement('div');
	      this.newInput = document.createElement('input');
	
	      this.originalSelect.classList.add('sb-select--original');
	
	      this.wrapper.classList.add('sb-select--this.wrapper');
	      dom.insertBefore(this.wrapper, this.originalSelect);
	      this.wrapper.appendChild(this.originalSelect);
	
	      this.newInput.setAttribute('type', 'text');
	      this.newInput.classList.add('sb-select--input');
	      dom.insertAfter(this.newInput, this.originalSelect);
	
	      this.createDropdown();
	    }
	  }, {
	    key: 'addListeners',
	    value: function addListeners() {
	      var _this = this;
	
	      this.newInput.addEventListener('click', function (e) {
	        return _this.openDropdown(e);
	      });
	      this.dropdown.addEventListener('click', function (e) {
	        return _this.updateSelect(e);
	      });
	
	      // this.originalSelect.addEventListener('change', this.updateSelect);
	    }
	  }, {
	    key: 'createDropdown',
	    value: function createDropdown() {
	      var options = this.originalSelect.querySelectorAll('option');
	      var optionsHTML = '';
	
	      this.dropdown = document.createElement('ul');
	      this.dropdown.classList.add('sb-select--dropdown');
	
	      options.forEach(function (option, index) {
	        optionsHTML += '\n        <li>\n          <button class="sb-select--option-button" data-index="' + index + '" value="' + option.value + '">\n            ' + option.innerHTML + '\n          </button>\n        </li>';
	      });
	      this.dropdown.innerHTML = optionsHTML;
	      dom.insertAfter(this.dropdown, this.newInput);
	    }
	  }, {
	    key: 'updateSelect',
	    value: function updateSelect(e) {
	      var target = e.target;
	      var value = target.innerHTML;
	      var index = target.attributes['data-index'].value;
	
	      e.preventDefault();
	
	      this.originalSelect.selectedIndex = index;
	      this.newInput.value = value;
	    }
	  }, {
	    key: 'openDropdown',
	    value: function openDropdown(e) {
	      var _this2 = this;
	
	      e.preventDefault();
	      e.stopPropagation();
	
	      this.dropdown.classList.add('sb-select--open');
	
	      this.closeListener = document.addEventListener('click', function (e) {
	        return _this2.closeDropdown(e);
	      });
	    }
	  }, {
	    key: 'closeDropdown',
	    value: function closeDropdown(e) {
	      document.removeEventListener('click', this.closeListener); //This needs to be more precise
	      this.dropdown.classList.remove('sb-select--open');
	    }
	  }]);
	
	  return SbSelect;
	}();
	
	var selectNode = document.querySelector('.sb-select');
	new SbSelect(selectNode);
	
	// function showList() {
	// }
	//
	// var sbSelect = function(options) {
	//   var defaults = {
	//         selector: '.sb-select'
	//       }
	//
	//   options = _defaults(options, defaults);
	//
	//   init(options.selector);
	// };
	//
	//
	// module.exports = sbSelect;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	  replaceNode: function replaceNode(newNode, oldNode) {
	    var parent = oldNode.parentNode;
	    parent.replaceChild(newNode, oldNode);
	  },
	
	  insertBefore: function insertBefore(newNode, referenceNode) {
	    referenceNode.parentNode.insertBefore(newNode, referenceNode);
	  },
	
	  insertAfter: function insertAfter(newNode, referenceNode) {
	    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
	  }
	};

/***/ }
/******/ ]);
//# sourceMappingURL=sb-select.js.map