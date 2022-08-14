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
$ nf COMMAND
running command...
$ nf (--version)
@node-flow/cli/0.0.1-alpha.9 linux-x64 node-v16.14.2
$ nf --help [COMMAND]
USAGE
  $ nf COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`nf flow [FLOWID]`](#nf-flow-flowid)
* [`nf flow activate [FLOWID]`](#nf-flow-activate-flowid)
* [`nf flow create`](#nf-flow-create)
* [`nf flow next [FLOWID]`](#nf-flow-next-flowid)
* [`nf flow remove FLOWNAME`](#nf-flow-remove-flowname)
* [`nf help [COMMAND]`](#nf-help-command)
* [`nf plugins`](#nf-plugins)
* [`nf plugins:install PLUGIN...`](#nf-pluginsinstall-plugin)
* [`nf plugins:inspect PLUGIN...`](#nf-pluginsinspect-plugin)
* [`nf plugins:install PLUGIN...`](#nf-pluginsinstall-plugin-1)
* [`nf plugins:link PLUGIN`](#nf-pluginslink-plugin)
* [`nf plugins:uninstall PLUGIN...`](#nf-pluginsuninstall-plugin)
* [`nf plugins:uninstall PLUGIN...`](#nf-pluginsuninstall-plugin-1)
* [`nf plugins:uninstall PLUGIN...`](#nf-pluginsuninstall-plugin-2)
* [`nf plugins update`](#nf-plugins-update)

## `nf flow [FLOWID]`

Create a Flow

```
USAGE
  $ nf flow [FLOWID] [-a]

FLAGS
  -a, --all  List all Flow

DESCRIPTION
  Create a Flow
```

_See code: [dist/commands/flow/index.js](https://github.com/WayneGongCN/hello-world/blob/v0.0.1-alpha.9/dist/commands/flow/index.js)_

## `nf flow activate [FLOWID]`

Create a Flow

```
USAGE
  $ nf flow activate [FLOWID] [--json]

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Create a Flow
```

## `nf flow create`

Create a Flow

```
USAGE
  $ nf flow create [--raw <value>]

FLAGS
  --raw=<value>

DESCRIPTION
  Create a Flow
```

## `nf flow next [FLOWID]`

Flow to the next state

```
USAGE
  $ nf flow next [FLOWID]

DESCRIPTION
  Flow to the next state

EXAMPLES
  flow next
```

## `nf flow remove FLOWNAME`

Remove a Flow

```
USAGE
  $ nf flow remove [FLOWNAME] [--nodes <value>]

FLAGS
  --nodes=<value>...

DESCRIPTION
  Remove a Flow
```

## `nf help [COMMAND]`

Display help for nf.

```
USAGE
  $ nf help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for nf.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.12/src/commands/help.ts)_

## `nf plugins`

List installed plugins.

```
USAGE
  $ nf plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ nf plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.0/src/commands/plugins/index.ts)_

## `nf plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ nf plugins:install PLUGIN...

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
  $ nf plugins add

EXAMPLES
  $ nf plugins:install myplugin 

  $ nf plugins:install https://github.com/someuser/someplugin

  $ nf plugins:install someuser/someplugin
```

## `nf plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ nf plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ nf plugins:inspect myplugin
```

## `nf plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ nf plugins:install PLUGIN...

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
  $ nf plugins add

EXAMPLES
  $ nf plugins:install myplugin 

  $ nf plugins:install https://github.com/someuser/someplugin

  $ nf plugins:install someuser/someplugin
```

## `nf plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ nf plugins:link PLUGIN

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
  $ nf plugins:link myplugin
```

## `nf plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ nf plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ nf plugins unlink
  $ nf plugins remove
```

## `nf plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ nf plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ nf plugins unlink
  $ nf plugins remove
```

## `nf plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ nf plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ nf plugins unlink
  $ nf plugins remove
```

## `nf plugins update`

Update installed plugins.

```
USAGE
  $ nf plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
