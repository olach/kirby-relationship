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
		$list_available.on('click', 'button:not([disabled])', function(event) {
			event.preventDefault();
			
			// Clicked item should be disabled:
			$(this).prop('disabled', true);
			
			// Get key of clicked item:
			var key = $(this).data('key');
			
			// Find item in unselected list:
			var $selected_item = $list_unselected.find('li[data-key="' + key + '"]');
			
			// Move the selected item to the end of the selected list:
			$selected_item.appendTo($list_selected);
			
			// Set the checkbox as checked:
			$selected_item.find('input').prop('checked', true);
			
			// Notify Kirby that some changes are made:
			$selected_item.find('input').trigger('change');
			
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
			
			// Move the selected item to the unselected list:
			$selected_item.appendTo($list_unselected);
			
			// Set the checkbox as unchecked:
			$selected_item.find('input').prop('checked', false);
			
			// Notify Kirby that some changes are made:
			$selected_item.find('input').trigger('change');
			
			// Get the key of the selected item:
			var key = $selected_item.data('key');
			
			// Make the selected item available again in the available list:
			$list_available.find('button[data-key="' + key + '"]').prop('disabled', false);
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
