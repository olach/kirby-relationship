/**
 * @namespace kirbyPlugin.Relationship
 */
var kirbyPlugin = kirbyPlugin || {};
kirbyPlugin.Relationship = kirbyPlugin.Relationship || {};

/**
 * Listbox object representing the state and interactions for a listbox widget.
 * 
 * @constructor
 * @param {Object} listboxNode - The HTMLElement used for the listbox.
 */
kirbyPlugin.Relationship.Listbox = function (listboxNode) {
	this.listboxNode      = listboxNode;
	this.activeDescendant = listboxNode.getAttribute('aria-activedescendant');
	this.multiselectable  = listboxNode.getAttribute('aria-multiselectable') === 'true';
	this.sortable         = listboxNode.getAttribute('data-sortable') === 'true';
	this.deletable        = listboxNode.getAttribute('data-deletable') === 'true';
	this.min              = listboxNode.getAttribute('data-min');
	this.max              = listboxNode.getAttribute('data-max');
	this.selectCallback   = function (element, selected) {};
	this.addCallback      = function (element) {};
	this.deleteCallback   = function (element) {};
	this.sortCallback     = function (element) {};

	this.checkMinMax();
	this.registerEvents();
};

/**
 * Register events for the listbox interactions.
 */
kirbyPlugin.Relationship.Listbox.prototype.registerEvents = function () {
	this.listboxNode.addEventListener('focus',     this.setupFocus.bind(this));
	this.listboxNode.addEventListener('keydown',   this.checkKeyPress.bind(this));
	this.listboxNode.addEventListener('click',     this.checkClickItem.bind(this));
	this.listboxNode.addEventListener('mousedown', this.checkMousedownItem.bind(this), false);
};

/**
 * Make sure an item is focused. If there is no activeDescendant, focus on the first option.
 * 
 * @param {Object} event - The event object passed by the event listener.
 */
kirbyPlugin.Relationship.Listbox.prototype.setupFocus = function (event) {
	if (this.activeDescendant) {
		var activeDescendant = this.listboxNode.querySelector('#' + this.activeDescendant);
		var activeDescendantisHidden = activeDescendant.getAttribute('aria-hidden') === 'true';
		
		if (activeDescendant && activeDescendantisHidden) {
			this.focusFirstItem();
			return;
		}
		
		this.focusItem(activeDescendant);
		return;
	}
	
	this.focusFirstItem();
};

/**
 * Focus on the specified item.
 * 
 * @param {Object} item - The HTMLElement to focus.
 */
kirbyPlugin.Relationship.Listbox.prototype.focusItem = function (item) {
	if (this.activeDescendant && this.activeDescendant !== item.id) {
		this.defocusItem(document.getElementById(this.activeDescendant));
	}
	
	item.classList.add('is-focused');
	this.setActiveDescendant(item.id);

	if (this.listboxNode.scrollHeight > this.listboxNode.clientHeight) {
		var scrollBottom = this.listboxNode.clientHeight + this.listboxNode.scrollTop;
		var itemBottom = item.offsetTop + item.offsetHeight;
		if (itemBottom > scrollBottom) {
			this.listboxNode.scrollTop = itemBottom - this.listboxNode.clientHeight;
		}
		else if (item.offsetTop < this.listboxNode.scrollTop) {
			this.listboxNode.scrollTop = item.offsetTop;
		}
	}
};

/**
 * Defocus the specified item.
 *
 * @param {Object} item - The HTMLElement to defocus
 */
kirbyPlugin.Relationship.Listbox.prototype.defocusItem = function (item) {
	item.classList.remove('is-focused');
	
	if (item.id === this.activeDescendant) {
		this.clearActiveDescendant();
	}
};

/**
 * Focus on the first option.
 */
kirbyPlugin.Relationship.Listbox.prototype.focusFirstItem = function () {
	var firstItem;

	firstItem = this.listboxNode.querySelector('[role="option"]:not([aria-hidden="true"])');

	if (firstItem) {
		this.focusItem(firstItem);
	}
};

/**
 * Focus on the last option.
 */
kirbyPlugin.Relationship.Listbox.prototype.focusLastItem = function () {
	var itemList = this.listboxNode.querySelectorAll('[role="option"]:not([aria-hidden="true"])');

	if (itemList.length) {
		this.focusItem(itemList[itemList.length - 1]);
	}
};

/**
 * Set active descendant.
 * 
 * @param {string} id - The id of an HTMLElement.
 */
kirbyPlugin.Relationship.Listbox.prototype.setActiveDescendant = function (id) {
	this.activeDescendant = id;
	this.listboxNode.setAttribute('aria-activedescendant', id);
};

/**
 * Clear active descendant.
 */
kirbyPlugin.Relationship.Listbox.prototype.clearActiveDescendant = function () {
	this.activeDescendant = null;
	this.listboxNode.setAttribute('aria-activedescendant', '');
};

/**
 * Check if the Listbox items exceeds the min/max values.
 *
 * @param {Object} item - The HTMLElement to adjust.
 */
kirbyPlugin.Relationship.Listbox.prototype.checkMinMax = function () {
	if (this.multiselectable) {
		var items = this.listboxNode.querySelectorAll('[role="option"][aria-selected="true"]').length;
	} else {
		var items = this.listboxNode.querySelectorAll('[role="option"]').length;
	}
	
	if ((this.min) && (items <= this.min)) {
		this.listboxNode.setAttribute('data-delete', 'disabled')
	} else {
		this.listboxNode.removeAttribute('data-delete');
	}
	
	if ((this.max) && (items >= this.max)) {
		this.listboxNode.setAttribute('data-add', 'disabled')
	} else {
		this.listboxNode.removeAttribute('data-add');
	}
};

/**
 * Check if an item is clicked on. If so, focus on it and select it.
 *
 * @param {Object} event - The mousedown event object.
 */
kirbyPlugin.Relationship.Listbox.prototype.checkMousedownItem = function (event) {
	event.preventDefault();
	var target = event.target;
	
	// Find the list item
	while (target !== event.currentTarget) {
		if (target.getAttribute('role') === 'option') {
			this.focusItem(target);
			break;
		}
		
		target = target.parentNode;
	}
	
	this.listboxNode.focus();
};

/**
 * Check if an item is clicked on. If so, focus on it and select it.
 *
 * @param {Object} event - The click event object.
 */
kirbyPlugin.Relationship.Listbox.prototype.checkClickItem = function (event) {
	if (this.sortable) {
		return;
	}
	
	var target = event.target;
	
	// Find the list item
	while (target !== event.currentTarget) {
		if (target.getAttribute('role') === 'option') {
			this.focusItem(target);
			this.toggleSelectItem(target);
			break;
		}
		
		target = target.parentNode;
	}
};

/**
 * Toggle the aria-selected value of an item.
 *
 * @param {Object} item - The HTMLElement to toggle.
 */
kirbyPlugin.Relationship.Listbox.prototype.toggleSelectItem = function (item) {
	if (item.getAttribute('aria-selected') === 'true') {
		this.deselectItem(item);
	} else {
		this.selectItem(item);
	}
};

/**
 * Set the aria-selected value of an item to true.
 *
 * @param {Object} item - The HTMLElement to adjust.
 */
kirbyPlugin.Relationship.Listbox.prototype.selectItem = function (item) {
	if (!this.multiselectable) {
		if (oldSelectedItem = this.listboxNode.querySelector('[role="option"][aria-selected="true"]')) {
			this.deselectItem(oldSelectedItem);
		}
	}
	
	if (this.multiselectable) {
		var selectedItems = this.listboxNode.querySelectorAll('[role="option"][aria-selected="true"]').length;
		if ((this.max) && (selectedItems >= this.max)) return false;
	}
	
	item.setAttribute('aria-selected', 'true');
	this.checkMinMax();
	this.selectCallback(item, true);
};

/**
 * Set the aria-selected value of an item to false.
 *
 * @param {Object} item - The HTMLElement to adjust.
 */
kirbyPlugin.Relationship.Listbox.prototype.deselectItem = function (item) {
	if (this.multiselectable) {
		var selectedItems = this.listboxNode.querySelectorAll('[role="option"][aria-selected="true"]').length;
		if ((this.min) && (selectedItems <= this.min)) return false;
	}
	
	item.setAttribute('aria-selected', 'false');
	this.checkMinMax();
	this.selectCallback(item, false);
};

/**
 * Add the specified item to the listbox. Assumes item are a valid option.
 *
 * @param {Object} item - An HTMLElement to add to the listbox.
 * @returns {Object} The HTMLElement that were added to the listbox.
 */
kirbyPlugin.Relationship.Listbox.prototype.addItem = function (item) {
	if ((this.max) && (this.listboxNode.childElementCount >= this.max)) return false;
	
	var addedItem = this.listboxNode.appendChild(item);
	
	this.checkMinMax();
	this.addCallback(addedItem);
	
	return addedItem;
};

/**
 * Remove the specified item from the listbox.
 * 
 * @param {Object} item - The HTMLElement to remove from the listbox.
 * @returns {Object} The HTMLElement that was removed from the listbox.
 */
kirbyPlugin.Relationship.Listbox.prototype.deleteItem = function (item) {
	if ((this.min) && (this.listboxNode.childElementCount <= this.min)) return false;
	
	var previousItem = item.previousElementSibling;
	var nextItem = item.nextElementSibling;
	
	if (this.activeDescendant === item.id) {
		if (previousItem) {
			this.focusItem(previousItem);
		} else if (nextItem) {
			this.focusItem(nextItem);
		} else {
			this.clearActiveDescendant();
		}
	}
	
	var deletedItem = this.listboxNode.removeChild(item);
	
	this.checkMinMax();
	this.deleteCallback(deletedItem);
	
	return deletedItem;
};

/**
 * Handle keyboard input.
 *
 * @param {Object} event - The keydown event object.
 */
kirbyPlugin.Relationship.Listbox.prototype.checkKeyPress = function (event) {
	var KeyCode = kirbyPlugin.Relationship.KeyCode;
	var key = event.which || event.keyCode;
	var item = document.getElementById(this.activeDescendant);
	var nextItem = item;
	
	if (!item) {
		return;
	}

	switch (key) {
		case KeyCode.PAGE_UP:
		case KeyCode.PAGE_DOWN:
			event.preventDefault();
			
			var count = 0;
			var itemsPerPage = Math.floor(this.listboxNode.clientHeight / nextItem.offsetHeight);
			
			if (key === KeyCode.PAGE_UP) {
				while (nextItem.previousElementSibling && count < itemsPerPage) {
					nextItem = nextItem.previousElementSibling;
					count++;
				}
			} else {
				while (nextItem.nextElementSibling && count < itemsPerPage) {
					nextItem = nextItem.nextElementSibling;
					count++;
				}
			}
			
			if (nextItem) {
				this.focusItem(nextItem);
			}
			
			break;
		case KeyCode.UP:
		case KeyCode.DOWN:
			event.preventDefault();
			
			if (this.sortable && item.getAttribute('aria-selected') === 'true') {
				if (key === KeyCode.UP) {
					this.moveUpItems();
				} else {
					this.moveDownItems();
				}
				
				break;
			}
			
			if (key === KeyCode.UP) {
				nextItem = item.previousElementSibling;
			} else {
				nextItem = item.nextElementSibling;
			}

			if (nextItem) {
				this.focusItem(nextItem);
			}

			break;
		case KeyCode.HOME:
			event.preventDefault();
			this.focusFirstItem();
			break;
		case KeyCode.END:
			event.preventDefault();
			this.focusLastItem();
			break;
		case KeyCode.SPACE:
			event.preventDefault();
			this.toggleSelectItem(item);
			break;
		case KeyCode.BACKSPACE:
		case KeyCode.DELETE:
			event.preventDefault();
			
			if (this.deletable) {
				this.deleteItem(item);
			}
			
			break;
	}
};

/**
 * Shifts the currently focused item up on the list.
 * No shifting occurs if the item is already at the top of the list.
 */
kirbyPlugin.Relationship.Listbox.prototype.moveUpItems = function () {
	var previousItem;

	if (!this.activeDescendant) {
		return;
	}

	currentItem = document.getElementById(this.activeDescendant);
	previousItem = currentItem.previousElementSibling;

	if (previousItem) {
		this.listboxNode.insertBefore(currentItem, previousItem);
		this.sortCallback(currentItem);
	}
};

/**
 * Shifts the currently focused item down on the list.
 * No shifting occurs if the item is already at the end of the list.
 */
kirbyPlugin.Relationship.Listbox.prototype.moveDownItems = function () {
	var nextItem;

	if (!this.activeDescendant) {
		return;
	}

	currentItem = document.getElementById(this.activeDescendant);
	nextItem = currentItem.nextElementSibling;

	if (nextItem) {
		this.listboxNode.insertBefore(nextItem, currentItem);
		this.sortCallback(currentItem);
	}
};
