# Trading manager

The trading manager project allow you to have an overview of your trading account, create your own trading strategies and make simulations with real trading datas to be sure it works!

---

## Table of contents

- [General info](#general-info)
- [Technologies](#technologies)
- [Requirements](#requirements)
- [Install](#install)
- [Configure](#configure)
- [Features](#features)
- [Status](#status)
- [Inspiration](#inspiration)

---

## General info

The purpose of this project is to allow any developer to quickly start in the big trading world. The dashboard gives you an overview of your current balance and the evolution of your favorite crypto. You can create your own trading strategies and make simulations (visible in the Opportunities tab) to find the best approach start investing in trading.

## Technologies

- Server side: Node.js with express.js
- Client side: React
- Trading API connectors:
  -- Crypto currencies: [binance API](https://binance-docs.github.io/apidocs/spot/en/)

## Requirements

You will need:

- git ([installation doc](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git))
- Node.js and npm ([installation doc](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm))
- Yarn for dependencies management ([installation doc](https://classic.yarnpkg.com/en/docs/install/))
- A binance account with API key ([create a free binance account doc](https://www.binance.com/en-AU/support/faq/115003764911) and [create binance API key doc](https://www.binance.com/en/support/faq/360002502072-How-to-create-API))

## Install

    $ git clone https://github.com/ddcreation/trading-manager
    $ cd trading-manager

### For local dev

    $ yarn install:all
    $ yarn start

### Or if you prefer [docker](https://www.docker.com)

    $ docker-compose up

## Configure

### Environment vars

- Create your dev environment file

      $ cp server/src/pre-start/env/example.env server/src/pre-start/env/development.env

- You can edit and put your own environment value.

### Change your favorites crypto

For the moment they are harcoded at the top of this file `server/src/shared/CryptoProviderApi.ts`. In the future the favorites cryptos will be set inside the user preferences.

### Create a new strategy for simulations

- Copy the example strategy

      $ cp server/src/shared/strategies/example.strategy.ts server/src/shared/strategies/YOUR-STRATEGY-NAME.strategy.ts

- Edit this file
  - Changing the name and params (class name, top public properties...)
  - Add calculated extra datas inside `historicToDataframe` method
  - Create your own rules to enter a position (inside `checkBuyOpportunity` and `checkSellOpportunity` methods), to close it (`exitRule` method), and stop loss (`stopLoss` method)

### Connection to connectors (Binance API only for the moment)

- You can set your connector parameters (ex: `BINANCE_API_KEY`, `BINANCE_API_SECRET`...) after login inside the app in the Account menu / Connectors

## Features

- Dashboard
  - Account balances
  - Shortcut to buy favorite crypto (WIP)
  - Graphs of favorites cryptos evolution
- Opportunities: for each favorites crypto:
  - Graphs of the evolution
  - Simulation of each trading strategy with Buy/sell alert
- Crypto
  - List of all existing crypto in binance with current price
- Account
  - Show binance account parameters and trading manager user preferences
  - Database of users
  - User signin / login / logout
  - Connectors parameters and configuration
- API Cron to launch jobs (open and close orders automatically in the future)

To come in the future

- User preferences management improvements (favorites symbols)
- Implement new connectors (robinhood?) and credentials for each
- On each screens, replace the loop on each connector to see aggregated datas in a single place (remove connector cards)
- Connect with API for open/close positions
- Automatically check tho opportunities and open positions and place orders / close
- More trading strategies
- ... (_waiting for your ideas_)

## Status

Project is: _in progress_

## Credits

I wanna give a special BIG UP to this dependencies that save a lot of days of hard work!

- Node Binance API that provide an interface with the API of binance [https://github.com/jaggedsoft/node-binance-api](https://github.com/jaggedsoft/node-binance-api)
- Grademark for simulations (soooo great guys!!!) [https://github.com/Grademark/grademark](https://github.com/Grademark/grademark)
- Node ta-lib [https://github.com/oransel/node-talib](https://github.com/oransel/node-talib)
