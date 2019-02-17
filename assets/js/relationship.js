(function($) {
	
	var Relationship = function(field) {
		
		// Get references to the item lists:
		var $list_available = $(field).find('.relationship-list--available');
		var $list_selected = $(field).find('.relationship-list--selected');
		
		// Initialize the listbox functionality on the lists:
		var listbox_available = new kirbyPlugin.Relationship.Listbox($list_available.get(0));
		var listbox_selected = new kirbyPlugin.Relationship.Listbox($list_selected.get(0));
		
		// Get references to search elements:
		var $search_input = $(field).find('.relationship-search input');
		var $search_items = $list_available.find('li');
		
		// Get reference to counter element:
		var $counter = $(field).siblings('.field-counter');
		var min = $list_selected.data('min');
		var max = $list_selected.data('max');
		
		// An item in the available list has been selected/deselected:
		listbox_available.selectCallback = function (item, selected) {
			if (selected) {
				listbox_selected.addItem(item.cloneNode(true));
			} else {
				var key = item.getAttribute('data-key');
				listbox_selected.deleteItem($list_selected.find('li[data-key="' + key + '"]').get(0));
			}
		}
		
		// An item is added to the selected list:
		listbox_selected.addCallback = function (addedItem) {
			var $addedItem = $(addedItem);
			
			// Change id to a unique value:
			$addedItem.attr('id', $addedItem.attr('id') + '_selected');
			
			// Clean the item from specific attributes and classes:
			$addedItem.attr('aria-selected', 'false');
			$addedItem.removeClass('is-focused');
			
			// Set the checkbox as checked:
			$addedItem.find('input').prop('checked', true);
			
			// Notify Kirby that some changes are made:
			$addedItem.find('input').trigger('change');
			
			updateCounter();
			
			// Scroll to bottom of the list to show the new item:
			$list_selected.stop().delay(20).animate({
				scrollTop: $list_selected[0].scrollHeight
			}, {
				duration: 600
			});
		}
		
		// Remove a selected item on click:
		$list_selected.on('click', 'button', function(event) {
			event.preventDefault();
			
			// Get a reference of the item to be removed from the selection:
			var $selected_item = $(this).closest('li');
			
			listbox_selected.deleteItem($selected_item.get(0));
		});
		
		// An item in the selected list has been deleted:
		listbox_selected.deleteCallback = function (deletedItem) {
			// Get the key of the deleted item:
			var key = $(deletedItem).data('key');
			
			// Get a reference of the item in the available list:
			var $available_item = $list_available.find('li[data-key="' + key + '"]');
			
			// Make the selected item unselected again in the available list:
			$available_item.attr('aria-selected', false);
			listbox_available.checkMinMax();
			
			// Notify Kirby that some changes are made:
			$available_item.find('input').trigger('change');
			
			updateCounter();
		}
		
		// Item in selected list has changed order:
		listbox_selected.sortCallback = function (element) {
			// Notify Kirby that the sort order has changed:
			$(element).find('input').trigger('change');
		}
		
		/**
		 * Make the list sortable using jQuery Sortable library
		 * Docs: http://api.jqueryui.com/sortable
		 */
		$list_selected.sortable({
			revert: 100,
			placeholder: 'ui-sortable-placeholder',
			start: function(event, ui) {
				ui.placeholder.height(ui.item.height());
			},
			update: function(event, ui) {
				// Notify Kirby that some changes are made:
				ui.item.find('input').trigger('change');
			}
		});
		
		/**
		 * Search the list when typing in the search input field:
		 */
		$search_input.on('input', function() {
			var search_term = $(this).val().toLowerCase();
			
			$search_items.each(function() {
				if ($(this).data('search-index').indexOf(search_term) > -1) {
					$(this).attr('aria-hidden', false);
				} else {
					$(this).attr('aria-hidden', true);
				}
			});
			
			// Scroll to top:
			$list_available.scrollTop(0);
		});
		
		/**
		 * Update the counter:
		 */
		function updateCounter() {
			var count = $list_selected.find('li').length;
			
			$counter.text(count + (max ? '/' + max : ''));
			
			if ((max && count > max) || (min && count < min)) {
				$counter.addClass('outside-range');
			} else {
				$counter.removeClass('outside-range');
			}
		}
	};
	
	/**
	 * Initialize the field:
	 */
	$.fn.relationship = function() {
		return this.each(function() {
			if ($(this).parent().is('.field-is-readonly, .field-is-disabled')) {
				return $(this);
			} else if ($(this).data('relationship')) {
				return $(this);
			} else {
				var relationship = new Relationship(this);
				$(this).data('relationship', relationship);
				return $(this);
			}
		});
	};
	
})(jQuery);
