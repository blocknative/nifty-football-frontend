import Vue from 'vue';
import Vuex from 'vuex';
import {ethers} from 'ethers';

import CardsApiService from "./services/api/cardsApi.service";
import {lookupEtherscanAddress} from "./utils";

import BlindPackContractService from "./services/contracts/blindPackContract.service";
import FootballCardsContractService from "./services/contracts/footballCardsContract.service";
import HeadToHeadContractService from "./services/contracts/headToHeadContract.service";

import HeadToHeadGameApiService from "./services/api/headToHeadGameApi.service";

Vue.use(Vuex);

/* global web3 */

export default new Vuex.Store({
    state: {
        networkId: 1,
        etherscanUrl: 'https://etherscan.io',

        ethAccount: null,
        account: null,// FIXME I dont like this name `account` - shouldn't it be accountDetails or accountCards
        web3Provider: null,

        // API Services
        cardsApiService: new CardsApiService(),
        headToHeadApiService: new HeadToHeadGameApiService(),

        // Contract Service
        blindPackService: null,
        footballCardsContractService: null,
        headToHeadContractService: null,
    },
    mutations: {
        ethAccount(state, ethAccount) {
            state.ethAccount = ethAccount;
        },
        account(state, account) {
            state.account = account;
        },
        etherscanUrl(state, etherscanUrl) {
            state.etherscanUrl = etherscanUrl;
        },
        provider(state, provider) {
            console.log(`Setting provider for network [${state.networkId}]`, provider);
            state.provider = provider;
            state.providerSigner = provider.getSigner();
            state.blindPackService = new BlindPackContractService(state.networkId, state.providerSigner);
            state.footballCardsContractService = new FootballCardsContractService(state.networkId, state.providerSigner);
            state.headToHeadContractService = new HeadToHeadContractService(state.networkId, state.providerSigner);
        },
        networkId(state, networkId) {
            state.networkId = networkId;
            // Override the default network of mainnet if we are switching
            if (state.networkId !== 1) {
                console.log(`Setting new network ID on service [${state.networkId}]`);
                state.cardsApiService.setNetworkId(networkId);
                state.headToHeadApiService.setNetworkId(networkId);
            }
        },
    },
    actions: {
        async loadAccount({commit, state}) {
            const provider = new ethers.providers.Web3Provider(web3.currentProvider);

            const {chainId, name} = await provider.getNetwork();
            console.log(`Working on network [${chainId}] [${name}]`);

            commit('networkId', chainId);
            commit('etherscanUrl', lookupEtherscanAddress(chainId));

            commit('provider', provider);

            const results = await state.cardsApiService.loadTokensForAccount(state.ethAccount);
            commit('account', results);
        }
    }
});
