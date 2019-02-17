# Kirby Relationship field

[![Latest version](https://img.shields.io/github/release/olach/kirby-relationship.svg?maxAge=1800)](https://github.com/olach/kirby-relationship/releases/latest) [![License](https://img.shields.io/github/license/mashape/apistatus.svg)](http://www.opensource.org/licenses/mit-license.php) [![Required Kirby version](https://img.shields.io/badge/kirby-2.5%2B-red.svg)](https://getkirby.com)

The Relationship field allows you to select and sort multiple items from a list. Think of it as a sortable multiselect field or a sortable checkboxes field.

![relationship-field-demo](https://user-images.githubusercontent.com/1300644/29208814-e1f92692-7e8b-11e7-857f-b646853d3ed8.gif)

This plugin is free to use. But if you find it helpful, feel free to [buy me a coffee](https://www.paypal.me/olachristensson/3usd) ☕️.

## Requirements
This field has been tested with Kirby 2.5+, but it should probably work with earlier versions too.

Looking for a version compatible with Kirby 3? [A new version](https://github.com/olach/kirby3-relationship) is currently in development.

## Installation
### Manually
[Download the files](https://github.com/olach/kirby-relationship/archive/master.zip) and place them inside `site/fields/relationship/`.

### With Kirby CLI
Kirby's [command line interface](https://github.com/getkirby/cli) makes the installation really simple:

    $ kirby plugin:install olach/kirby-relationship

Updating is also easy:

    $ kirby plugin:update olach/kirby-relationship

## Usage
The field is an extension of the [Checkboxes field](https://k2.getkirby.com/docs/cheatsheet/panel-fields/checkboxes). All options of that field apply to this field too. The data is saved as a comma separated string, which means that this field is interchangeable with the Checkboxes field.

### Example with predefined options
#### Blueprint

```yaml
countries:
  label: Countries
  type: relationship
  options:
    sweden: Sweden
    norway: Norway
    denmark: Denmark
    finland: Finland
    iceland: Iceland
    germany: Germany
    france: France
    spain: Spain
    portugal: Portugal
```

#### Template

```php
<ul>
  <?php foreach ($page->countries()->split() as $country): ?>
  <li><?= $country ?></li>
  <?php endforeach ?>
</ul>
```

### Example with related pages
#### Blueprint

```yaml
related:
  label: Related articles
  type: relationship
  options: query
  query:
    fetch: siblings
```

#### Template

```php
<h2>Related articles</h2>
<ul>
  <?php foreach ($page->related()->pages(',') as $related): ?>
  <li>
    <a href="<?php echo $related->url() ?>">
      <?= $related->title() ?>
    </a>
  </li>
  <?php endforeach ?>
</ul>
```

## Features

### Search:
To enable search, add `search: true` to the field settings in your blueprint.

```yaml
related:
  label: Related articles
  type: relationship
  options: query
  query:
    fetch: siblings
  search: true
```

### Min and max items:
You can control the minimum number of required items and the maximum number of allowed items. Don't forget to add a help text to inform the editor about the requirements.

```yaml
related:
  label: Related articles
  type: relationship
  options: query
  query:
    fetch: siblings
  search: true
  min: 3
  max: 6
  help: Select from 3 up to 6 articles.
```

### Counter indicator
 A handy indicator of the current amount of selected items can be displayed in the upper right corner with the option `counter`. This indicator is always shown when the min/max option is active, but can be disabled by setting its value to `false`.

```yaml
related:
  label: Related articles
  type: relationship
  options: query
  query:
    fetch: siblings
  search: true
  counter: true
```

### Controller:
This field is extended with an option to use a user specified function to have even more control of the options that will be loaded. The idea is taken from the [Controlled List plugin](https://github.com/rasteiner/controlledlist).

#### Example
Create a simple plugin that lets you choose from the panel users.

`site/plugins/myplugin/myplugin.php`:

```php
class MyPlugin {
  static function userlist($field) {
    $kirby = kirby();
    $site = $kirby->site();
    $users = $site->users();

    $result = array();

    foreach ($users as $user) {
      if (!empty($user->firstName()) && !empty($user->lastName())) {
        $result[$user->username()] = $user->firstName() . ' ' . $user->lastName();
      } else {
        $result[$user->username()] = $user->username();
      }
    }

    return $result;
  }
}
```

In your blueprint:

```yaml
users:
  label: Users
  type: relationship
  controller: MyPlugin::userlist
```

### Thumbnails:
It's possible to show a small thumbnail for each list item. There are three different ways to do this:

#### Options list
Manually specify a set of URLs pointing to images to be used as thumbnails.

No downscaling is performed here, the images are used as is. So be kind to your users and don't link to high resolution images.

```yaml
countries:
  label: Countries
  type: relationship
  options:
    sweden: Sweden
    norway: Norway
    denmark: Denmark
    finland: Finland
    iceland: Iceland
    germany: Germany
    france: France
    spain: Spain
    portugal: Portugal
  thumbs:
    options:
      sweden: /assets/images/flag-sweden.png
      norway: /assets/images/flag-norway.png
      denmark: /assets/images/flag-denmark.png
      finland: /assets/images/flag-finland.png
      iceland: /assets/images/flag-iceland.png
      germany: /assets/images/flag-germany.png
      france: /assets/images/flag-france.png
      spain: /assets/images/flag-spain.png
      portugal: /assets/images/flag-portugal.png
```

#### Image field
By specifying the field name of an image field, the thumbnails can be fetched automatically. This requires that the list items are regular pages with an image field specified. Also, make sure that the value attribute used are page URIs.

The images are shown downscaled. The default thumbnail size of the panel is used, so no additional thumbnail generation is being done.

```yaml
related:
  label: Related articles
  type: relationship
  options: query
  query:
    fetch: siblings
    value: '{{uri}}'
  thumbs:
    field: featured_image
```

#### Thumbnails controller
For full control, you can specify a user specified function to be used for the thumbnails. The function needs to return a URL to an image.

The following example extends the previous panel users example by showing their avatars as thumbnails.

`site/plugins/myplugin/myplugin.php`:

```php
class MyPlugin {
  static function userlist($field) {
    $kirby = kirby();
    $site = $kirby->site();
    $users = $site->users();

    $result = array();

    foreach ($users as $user) {
      if (!empty($user->firstName()) && !empty($user->lastName())) {
        $result[$user->username()] = $user->firstName() . ' ' . $user->lastName();
      } else {
        $result[$user->username()] = $user->username();
      }
    }

    return $result;
  }

  static function useravatar($key, $field) {
    $kirby = kirby();
    $site = $kirby->site();

    $url = '';

    if ($avatar = $site->user($key)->avatar()):
      $url = $avatar->crop(75)->url();
    endif;

    return $url;
  }
}
```

In your blueprint:

```yaml
users:
  label: Users
  type: relationship
  controller: MyPlugin::userlist
  thumbs:
    controller: MyPlugin::useravatar
```

### Keyboard navigation:
The field is keyboard accessible. Press <kbd>tab</kbd> and <kbd>shift + tab</kbd> to give focus to the lists. Within a list, use the arrow keys to navigate and press <kbd>space</kbd> to select/deselect an item. In the sortable list, you can sort the items by selecting an item with <kbd>space</kbd> and then move the item using the arrow keys.

## Version history
You can find the version history in the [changelog](changelog.md).

## License
[MIT License](http://www.opensource.org/licenses/mit-license.php)
