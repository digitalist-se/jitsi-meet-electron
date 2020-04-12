/* eslint-env es6*/

/**
    @file notarize.js
    @author Colin Campbell <colin.campbell@digitalistgroup.com>
    Script to notarize a MacOS binary with Apple's notarization service.
    (Allows distribution for Macs outside the App Store.)
    Requires environment variables APPLE_ID and APPLE_ID_PASSWORD to be set,
    where APPLE_ID_PASSWORD is an app-specific password fopr scripts.
    NOT YOUR OWN PASSWORD!
    @see https://support.apple.com/en-us/HT204397

 */

const fs = require('fs');
const path = require('path');
const process = require('process');
const { notarize } = require('electron-notarize');

exports.default = async function notarizing(context) {
    const { electronPlatformName, appOutDir } = context;

    if (electronPlatformName !== 'darwin') {
        return;
    }


    const appName = context.packager.appInfo.productFilename;
    const appBundleId = context.packager.appInfo.macBundleIdentifier;
    const appPath = path.join(appOutDir, `${appName}.app`);

    if (!process.env.APPLE_ID) {
        throw new Error(`Not notarizing ${appName}: APPLE_ID environment variable not set`);
    }

    if (!process.env.APPLE_ID_PASSWORD) {
        throw new Error(`Not notarizing ${appName}: APPLE_ID_PASSWORD environment variable not set`);
    }


    if (!fs.existsSync(appPath)) {
        throw new Error(`Cannot find application at: ${appPath}`);
    }

    return await notarize({
        appBundleId,
        appPath,
        appleId: process.env.APPLE_ID,
        appleIdPassword: process.env.APPLE_ID_PASSWORD
    });
};
