ftctl
=====

CLI tool for minimal automation of Drone CD flow using Helm Chart type deployment.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ftctl.svg)](https://npmjs.org/package/ftctl)
[![Downloads/week](https://img.shields.io/npm/dw/ftctl.svg)](https://npmjs.org/package/ftctl)
[![License](https://img.shields.io/npm/l/ftctl.svg)](https://github.com/wilson_13/ftctl/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g ftctl
$ ftctl COMMAND
running command...
$ ftctl (-v|--version|version)
ftctl/1.0.6 darwin-x64 node-v12.12.0
$ ftctl --help [COMMAND]
USAGE
  $ ftctl COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ftctl help [COMMAND]`](#ftctl-help-command)
* [`ftctl release-stage [STRING]`](#ftctl-release-stage-string)

## `ftctl help [COMMAND]`

display help for ftctl

```
USAGE
  $ ftctl help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_

## `ftctl release-stage [STRING]`

This command updates helm chart values.yaml (image.tag) and Chart.yaml (appVersion) to be the version provided as argument. 

```
USAGE
  $ ftctl release-stage [STRING]

OPTIONS
  -h, --help             show CLI help
  -p, --path=path        path to chart's root folder
  -v, --version=version  version to build and release

DESCRIPTION
  This command updates helm chart values.yaml (image.tag) and Chart.yaml (appVersion) to be the version provided as 
  argument. 
  After updating these values, it also performs upload the new chart and execute git tag and push tag. Note: Chart 
  version should be updated manually.

EXAMPLE
  $ ftctl release-stage -v 0.1.0-beta.1 -p ../your-chart/
  App versioned '0.1.0-beta.1' build and releasing to staging initiated.
```

_See code: [src/commands/release-stage.ts](https://github.com/Wilson13/ftctl/blob/v1.0.6/src/commands/release-stage.ts)_
<!-- commandsstop -->
