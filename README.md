# Introduction

This is a simple react cli.

## Install

`npm i -g chosan-cli`

## Usage

Now you can create a react project with `ssr` command:

1、`ssr new react-proj`

This command will create a new react project named `react-proj`.

2、To install dependencies:

`cd react-proj`

`npm i`

3、To create a new route:

`ssr g route --name=operation/steps/one`

which is an alias of 

`ssr g route operation/steps/one`

this will create a recursive route under `src/pages/`.

4、To create a new component:

`ssr g comp operation/steps/one/dialog`

which is an alias of 

`ssr g component --name=operation/steps/one/dialog`

this will just create a component under path: `operation/steps/one/`

or you can create a global component:

`ssr g comp dialog`

which will create a dialog component under `src/components/`

5、To run this project:

`npm start`


There are more commands waiting for you, come on!