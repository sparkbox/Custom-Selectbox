'use strict';

module.exports = {
  replaceNode: (newNode, oldNode) => {
    let parent = oldNode.parentNode;
    parent.replaceChild(newNode, oldNode)
  },

  insertBefore: (newNode, referenceNode) => {
    referenceNode.parentNode.insertBefore(newNode, referenceNode);
  },

  insertAfter: (newNode, referenceNode) => {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }
};
