'use strict';

// const _defaults = require('lodash.defaults');
const dom = require('./dom');

const KEYS = {
        UP: 38,
        DOWN: 40
      };

class SbSelect {
  constructor(originalSelect) {
    this.originalSelect = originalSelect;
    this.createElements();
    this.addListeners();
  }

  createElements(originalSelect) {
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

  addListeners() {
    this.newInput.addEventListener('click', e => this.openDropdown(e));
    this.dropdown.addEventListener('click', e => this.updateSelect(e));
    this.newInput.addEventListener('keypress', e => this.handleKeys(e));
  }

  createDropdown() {
    let options = this.originalSelect.querySelectorAll('option');
    let optionsHTML = '';

    this.dropdown = document.createElement('ul');
    this.dropdown.classList.add('sb-select--dropdown');

    options.forEach((option, index) => {
      optionsHTML += `
        <li>
          <button class="sb-select--option-button" data-index="${index}" value="${option.value}">
            ${option.innerHTML}
          </button>
        </li>`;
    });
    this.dropdown.innerHTML = optionsHTML;
    dom.insertAfter(this.dropdown, this.newInput);
  }

  updateSelect(e) {
    let target = e.target;
    let value = target.innerHTML;
    let index = target.attributes['data-index'].value;

    e.preventDefault();

    this.originalSelect.selectedIndex = index;
    this.newInput.value = value;
  }

  openDropdown(e) {
    e.preventDefault();
    e.stopPropagation();

    this.dropdown.classList.add('sb-select--open');

    this.closeListener = document.addEventListener('click', e => this.closeDropdown(e));
  }

  closeDropdown(e) {
    document.removeEventListener('click', this.closeListener); //This needs to be more precise
    this.dropdown.classList.remove('sb-select--open');
  }

  handleKeys(e) {
    debugger;
    console.log(e.keyCode);
  }

  keyHandlers = {
    UP: this.moveSelectionUp,
    DOWN: this.moveSelectionDown
  }
}

let selectNode = document.querySelector('.sb-select');
new SbSelect(selectNode);
