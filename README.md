## Trivia 4 Ether

Are you ready to put your knowledge to the test and earn real cryptocurrency? Get ready to embark on an exciting journey with our groundbreaking trivia app 
built using the power of Solidity and React. We present to you an innovative platform that merges entertainment, 
competition, and the thrill of winning Ethereum (ETH) in a format reminiscent of the beloved "Who Wants to Be a Millionaire" game show.

## Steps to Deploy
- clone the repo with
```
git clone git@github.com:dafejimi/eth-trivia.git
```
- change directory into all project folders and install project dependencies with npm, by running the command:
```
npm install
```
- change directory into the the contracts folder to deploy the contracts, with:
```
npx hardhat deploy --network [network-name]
```
- Optionally , you could setup your own chainlink subscription for VRF and keepers, have a look at the docs to get an understanding of how that works
[title]((https://docs.chain.link/))
- change directory into the fronend folder and, start up the front-end using:
```
npm run dev
```
- change directory into the json server folder, and run the following commands to startup your rest endpoints
```
jsonserver --watch players
jsonserver --watch entrants
```
- Once you have the frontend running at localhost:5000, it's now time to style to your desired taste.
