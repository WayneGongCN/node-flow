oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @node-flow/cli
$ flow COMMAND
running command...
$ flow (--version)
@node-flow/cli/0.0.0 darwin-x64 node-v14.17.0
$ flow --help [COMMAND]
USAGE
  $ flow COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`flow hello PERSON`](#flow-hello-person)
* [`flow hello world`](#flow-hello-world)
* [`flow help [COMMAND]`](#flow-help-command)
* [`flow plugins`](#flow-plugins)
* [`flow plugins:install PLUGIN...`](#flow-pluginsinstall-plugin)
* [`flow plugins:inspect PLUGIN...`](#flow-pluginsinspect-plugin)
* [`flow plugins:install PLUGIN...`](#flow-pluginsinstall-plugin-1)
* [`flow plugins:link PLUGIN`](#flow-pluginslink-plugin)
* [`flow plugins:uninstall PLUGIN...`](#flow-pluginsuninstall-plugin)
* [`flow plugins:uninstall PLUGIN...`](#flow-pluginsuninstall-plugin-1)
* [`flow plugins:uninstall PLUGIN...`](#flow-pluginsuninstall-plugin-2)
* [`flow plugins update`](#flow-plugins-update)

## `flow hello PERSON`

Say hello

```
USAGE
  $ flow hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Whom is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/WayneGongCN/hello-world/blob/v0.0.0/dist/commands/hello/index.ts)_

## `flow hello world`

Say hello world

```
USAGE
  $ flow hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ oex hello world
  hello world! (./src/commands/hello/world.ts)
```

## `flow help [COMMAND]`

Display help for flow.

```
USAGE
  $ flow help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for flow.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `flow plugins`

List installed plugins.

```
USAGE
  $ flow plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ flow plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.0/src/commands/plugins/index.ts)_

## `flow plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ flow plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ flow plugins add

EXAMPLES
  $ flow plugins:install myplugin 

  $ flow plugins:install https://github.com/someuser/someplugin

  $ flow plugins:install someuser/someplugin
```

## `flow plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ flow plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ flow plugins:inspect myplugin
```

## `flow plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ flow plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ flow plugins add

EXAMPLES
  $ flow plugins:install myplugin 

  $ flow plugins:install https://github.com/someuser/someplugin

  $ flow plugins:install someuser/someplugin
```

## `flow plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ flow plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ flow plugins:link myplugin
```

## `flow plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ flow plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ flow plugins unlink
  $ flow plugins remove
```

## `flow plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ flow plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ flow plugins unlink
  $ flow plugins remove
```

## `flow plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ flow plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ flow plugins unlink
  $ flow plugins remove
```

## `flow plugins update`

Update installed plugins.

```
USAGE
  $ flow plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
