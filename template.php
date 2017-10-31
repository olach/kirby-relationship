<?php
$uniqid = uniqid('relationship_'); // Generate a unique id for this field instance

$all_options = $field->options(); // All available options
$values = $field->value(); // All selected options

// "$field->options()" contains both the key and the value. E.g. the page url and title.
// "$field->value()" contains only the key. E.g. only the page url.
// Make a new array with selected options stored with both the key and value:
$selected_options = [];
foreach ($values as $value) {
	$selected_options[$value] = $all_options[$value];
}
?>

<div class="field-content">
	<div class="relationship-field" data-field="relationship">
		
		<?php if ($field->search()): ?>
		<div class="relationship-search">
			<i class="icon fa fa-search"></i>
			<input class="input" type="text" />
		</div>
		<?php endif ?>
		
		<div class="relationship-lists">
			<ul class="relationship-list relationship-list--available" role="listbox" aria-multiselectable="true" aria-activedescendant="" tabindex="0">
				<?php $counter = 0 ?>
				<?php foreach ($all_options as $key => $value): ?>
					<?php $counter++ ?>
					<li id="<?php echo $uniqid.'_'.$counter ?>" role="option" data-key="<?php echo $key; ?>"<?php e($field->search(), ' data-search-index="' . mb_strtolower($value) . '"') ?> aria-selected="<?php e(array_key_exists($key, $selected_options), 'true', 'false') ?>">
						<input type="checkbox" name="<?php echo $field->name() . '[]' ?>" value="<?php echo $key ?>" aria-hidden="true" />
						<span class="relationship-item-sort">
							<i class="icon fa fa-bars" aria-hidden="true"></i>
						</span>
						<?php echo $field->thumbnail($key) ?>
						<span class="relationship-item-label">
							<?php echo $value ?>
						</span>
						<button class="relationship-item-add" tabindex="-1" type="button" aria-label="<?php echo i18n('add') ?> <?php echo $value ?>">
							<i class="icon fa fa-plus-circle" aria-hidden="true"></i>
						</button>
						<button class="relationship-item-delete" tabindex="-1" type="button" aria-label="<?php echo i18n('delete') ?> <?php echo $value ?>">
							<i class="icon fa fa-minus-circle" aria-hidden="true"></i>
						</button>
					</li>
				<?php endforeach ?>
			</ul>
			
			<ul class="relationship-list relationship-list--selected" role="listbox" aria-activedescendant="" data-sortable="true" data-deletable="true" tabindex="0">
				<?php $counter = 0 ?>
				<?php foreach ($selected_options as $key => $value): ?>
					<?php $counter++ ?>
					<li id="<?php echo $uniqid.'_'.$counter.'_preselected' ?>" role="option" data-key="<?php echo $key; ?>">
						<input type="checkbox" name="<?php echo $field->name() . '[]' ?>" value="<?php echo $key ?>" aria-hidden="true" checked />
						<span class="relationship-item-sort">
							<i class="icon fa fa-bars" aria-hidden="true"></i>
						</span>
						<?php echo $field->thumbnail($key) ?>
						<span class="relationship-item-label">
							<?php echo $value; ?>
						</span>
						<button class="relationship-item-add" tabindex="-1" type="button" aria-label="<?php echo i18n('add') ?> <?php echo $value ?>">
							<i class="icon fa fa-plus-circle" aria-hidden="true"></i>
						</button>
						<button class="relationship-item-delete" tabindex="-1" type="button" aria-label="<?php echo i18n('delete') ?> <?php echo $value ?>">
							<i class="icon fa fa-minus-circle" aria-hidden="true"></i>
						</button>
					</li>
				<?php endforeach ?>
			</ul>
		</div>
		
	</div>
</div>
