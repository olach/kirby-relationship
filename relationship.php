<?php

class RelationshipField extends CheckboxesField {
	
	public $controller;
	public $search;
	public $thumbs;
	
	static public $assets = array(
		'js' => array(
			'relationship-keycode.js',
			'relationship-listbox.js',
			'relationship.js'
		),
		'css' => array(
			'relationship.css'
		)
	);
	
	/**
	 * This field can load a user specified function if set in the blueprint.
	 */
	public function options() {
		if ($this->controller()) {
			return call_user_func($this->controller(), $this);
		} else {
			return parent::options();
		}
	}
	
	/**
	 * Use a template file to build all html.
	 */
	public function content() {
		return tpl::load(__DIR__ . DS . 'template.php', array('field' => $this));
	}
	
	/**
	 * Generate a thumbnail if requested.
	 */
	public function thumbnail($key) {
		if (!$this->thumbs()):
			return;
		endif;
		
		$thumbs = $this->thumbs();
		$url = '';
		
		if (isset($thumbs['controller'])):
			$url = call_user_func($thumbs['controller'], $key, $this);
		elseif (isset($thumbs['options'])):
			$url = isset($thumbs['options'][$key]) ? $thumbs['options'][$key] : '';
		elseif (isset($thumbs['field'])):
			if ($page = page($key)):
				if ($thumb = $page->content()->get($thumbs['field'])->toFile()):
					$url = $thumb->crop(75)->url();
				endif;
			endif;
		endif;
		
		if ($url):
			$thumbnail = new Brick('img');
			$thumbnail->attr('src', $url);
		else:
			$thumbnail = new Brick('span');
		endif;
		
		$thumbnail->addClass('relationship-item-thumb');
		
		return $thumbnail;
	}
}
