<?php

class RelationshipField extends CheckboxesField {
	
	public $controller;
	public $search;
	
	static public $assets = array(
		'js' => array(
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
	
}
