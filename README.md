[![Gem Version](https://img.shields.io/gem/v/jekyll-admin.svg)](https://rubygems.org/gems/jekyll-admin)
[![Build Status](https://travis-ci.org/jekyll/jekyll-admin.svg?branch=master)](https://travis-ci.org/jekyll/jekyll-admin)
[![Build status](https://ci.appveyor.com/api/projects/status/biop1r6ae524xlm2/branch/master?svg=true)](https://ci.appveyor.com/project/benbalter/jekyll-admin/branch/master)

A Jekyll plugin that provides users with a traditional CMS-style graphical interface to author content and administer Jekyll sites. The project is divided into two parts. A Ruby-based HTTP API that handles Jekyll and filesystem operations, and a Javascript-based front end, built on that API.

![screenshot of Jekyll Admin](https://cloud.githubusercontent.com/assets/282759/17258537/62e23ed6-5595-11e6-89b0-31c787f0492a.png)

## Installation

Refer to the [installing plugins](https://jekyllrb.com/docs/plugins/#installing-a-plugin) section of Jekyll's documentation and install the `jekyll-admin` plugin as you would any other plugin. Here's the short version:

1. Add the following to you site's Gemfile:

    ```ruby
    gem 'jekyll-admin', group: :jekyll_plugins
    ```

2. Run `bundle install`

## Usage

1. Start Jekyll as you would normally (`bundle exec jekyll serve`)
2. Navigate to `http://localhost:4000/admin` to access the administrative interface

## Contributing

Interested in contributing to Jekyll Admin? We’d love your help. Jekyll Admin is an open source project, built one contribution at a time by users like you. See [the contributing instructions](.github/CONTRIBUTING.md), and [the development docs](http://jekyll.github.io/jekyll-admin/development/) for more information.

## License

The gem is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).
