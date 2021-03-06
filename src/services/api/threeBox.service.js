import {dotDotDotAccount} from "../../utils";

const Box = require('3box');

const NIFTY_FOOTY_SPACE = 'nifty-football';

const SQUAD_NAME = 'squad-name';

export default class ThreeBoxService {

    setAccount(account) {
        this.account = account;
    }

    setProvider(provider) {
        this.provider = provider;
    }

    async getReadOnlyProfile() {
        const profile = await this._getProfileSafe(this.account);
        console.log(`Found read only 3box profile`, profile);
        return profile;
    }

    async getSquadName() {

        const squadName = await this.getBox3SquadName();
        console.log("squadName", squadName);

        if (squadName) {
            return {
                found: true,
                name: squadName
            };
        }

        const profile = await this.getReadOnlyProfile();
        if (profile && profile.name) {
            console.log("Profile Name", profile.name);
            return {
                found: true,
                name: profile.name
            };
        }

        return {
            found: false,
            name: dotDotDotAccount(this.account)
        };
    }

    async setSquadName(name) {
        if (!this.space) {
            const box = await Box.openBox(this.account, this.provider);
            this.space = await box.openSpace(NIFTY_FOOTY_SPACE);
        }

        await this.space.public.set(SQUAD_NAME, name);

        return name;
    }

    async getBox3SquadName() {
        if (!this.space) {
            const box = await Box.openBox(this.account, this.provider);
            this.space = await box.openSpace(NIFTY_FOOTY_SPACE);
        }

        return this.space.public.get(SQUAD_NAME);
    }

    async getBox3SquadDisplayName(account) {

        // Try open space
        const niftySpace = await this._getSpaceSafe(account);
        if (niftySpace && niftySpace[SQUAD_NAME]) {
            return niftySpace[SQUAD_NAME];
        }

        // Try get public name
        const profile = await this._getProfileSafe(account);
        if (profile && profile.name) {
            return profile.name;
        }

        // Fallback to eth account
        return account;
    }

    async _getProfileSafe(account) {
        try {
            return await Box.getProfile(account);
        } catch (e) {
            return null;
        }
    }

    async _getSpaceSafe(account) {
        try {
            return await Box.getSpace(account, NIFTY_FOOTY_SPACE);
        } catch (e) {
            return null;
        }
    }
}
