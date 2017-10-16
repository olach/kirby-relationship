# Kirby Relationship field

The Relationship field allows you to select and sort multiple items from a list. Think of it as a sortable multiselect field or a sortable checkboxes field.

![relationship-field-demo](https://user-images.githubusercontent.com/1300644/29208814-e1f92692-7e8b-11e7-857f-b646853d3ed8.gif)

## Requirements
This field has been tested with Kirby 2.5+, but it should probably work with earlier versions too.

## Installation
### Manually
[Download the files](https://github.com/olach/kirby-relationship/archive/master.zip) and place them inside `site/fields/relationship/`.

### With Kirby CLI
Kirby's [command line interface](https://github.com/getkirby/cli) makes the installation really simple:

    $ kirby plugin:install olach/kirby-relationship

Updating is also easy:

    $ kirby plugin:update olach/kirby-relationship

## Usage
The field is an extension of the [Checkboxes field](https://getkirby.com/docs/cheatsheet/panel-fields/checkboxes). All options of that field apply to this field too. The data is saved as a comma separated string, which means that this field is interchangeable with the Checkboxes field.

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

## Extra features

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

## Version history
You can find the version history in the [changelog](changelog.md).

## License
[MIT License](http://www.opensource.org/licenses/mit-license.php)
