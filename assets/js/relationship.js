(function($) {
	
	var Relationship = function(field) {
		
		// Get references to the item lists:
		var $list_available = $(field).find('.relationship-list--available');
		var $list_selected = $(field).find('.relationship-list--selected');
		var $list_unselected = $(field).find('.relationship-list--unselected');
		
		// Get references to search elements:
		var $search_input = $(field).find('.relationship-search input');
		var $search_items = $list_available.find('li');
		
		/**
		 * Add an item to the selection on click:
		 */
		$list_available.on('click', 'li:not([aria-selected="true"])', function(event) {
			event.preventDefault();
			
			// Clone selected item:
			var $cloned_item = $(this).clone();
			
			// Move the selected item to the end of the selected list:
			$cloned_item.appendTo($list_selected);
			
			// Change id to a unique value:
			$cloned_item.attr('id', $cloned_item.attr('id') + '_selected');
			
			// Set the checkbox as checked on the cloned item:
			$cloned_item.find('input').prop('checked', true);
			
			// Notify Kirby that some changes are made:
			$cloned_item.find('input').trigger('change');
			
			// Clicked item should be marked as selected:
			$(this).attr('aria-selected', 'true');
			
			// Scroll to bottom of the list to show the new item:
			$list_selected.stop().delay(20).animate({
				scrollTop: $list_selected[0].scrollHeight
			}, {
				duration: 600
			});
		});
		
		/**
		 * Remove a selected item on click:
		 */
		$list_selected.on('click', 'button', function(event) {
			event.preventDefault();
			
			// Get a reference of the item to be removed from the selection:
			var $selected_item = $(this).closest('li');
			
			// Get the key of the selected item:
			var key = $selected_item.data('key');
			
			// Remove the selected item:
			$selected_item.remove();
			
			// Get a reference of the available item:
			var $available_item = $list_available.find('li[data-key="' + key + '"]');
			
			// Make the selected item available again in the available list:
			$available_item.attr('aria-selected', 'false');
			
			// Notify Kirby that some changes are made:
			$available_item.find('input').trigger('change');
		});
		
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
	};
	
	/**
	 * Initialize the field:
	 */
	$.fn.relationship = function() {
		return this.each(function() {
			if ($(this).data('relationship')) {
				return $(this);
			} else {
				var relationship = new Relationship(this);
				$(this).data('relationship', relationship);
				return $(this);
			}
		});
	};
	
})(jQuery);
