# Welcome to aurora-up 👋

[![Build Status](https://travis-ci.org/drg-adaptive/aurora-up.svg?branch=master)](https://travis-ci.org/drg-adaptive/aurora-up)
[![Version](https://img.shields.io/npm/v/aurora-up.svg)](https://www.npmjs.com/package/aurora-up)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

Wait for paused aurora clusters to scale up

### 🏠 [Homepage](https://github.com/drg-adaptive/aurora-up)

## Install

```sh
yarn global add aurora-up
```

## Usage

You can use aurora-up either by providing an Aurora cluster identifier directly, or by passing in a CloudFormation stack name and Output name.

_CloudFormation method_

```bash
aurora-up --region us-east-1 --stack TestService --output SomeOutputName
```

_Cluster Identifier Method_

```bash
aurora-up --region us-east-1 --cluster SomeClusterId
```

### Minimum Capacity

You can provide a target capacity using the `minCapacity` parameter. If your provided target
capacity is outside of the cluster's Min/Max capacity settings, the program will adjust
it to a valid value.

## Author

👤 **Ben Force**

- Github: [@theBenForce](https://github.com/theBenForce)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/drg-adaptive/aurora-up/issues).

## Show your support

Give a ⭐️ if this project helped you!

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
