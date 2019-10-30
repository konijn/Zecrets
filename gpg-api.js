/*
Application: Zecrets, a GUI leveraging GPG to colloborate on encrypted documents
Copyright (C) 2019  Tom J Demuyt

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

//All PGP stuff
//TODO, parse https://files.gpg4win.org/ and get the latest, skipping the PayPal guilt trip
//Fun stuff
//http://irtfweb.ifa.hawaii.edu/~lockhart/gpg/
//foo

/*jshint esversion: 6 */

//Allow for synchronous OS calls
const { execSync } = require('child_process');
const fs = require('fs');
const utf8Encoding = {encoding: "utf8"};

const gpg = (function createGpgObject() {

  function checkVersion() {
    let version = sessionStorage.getItem('tmp.gpg.version');
    let info = '';
    if (!version) {
      const getVersionInfo = "gpg --version";
      info = execSync(getVersionInfo, utf8Encoding);
      if (!info.startsWith("gpg (GnuPG)")) {
        alert("This application requires GPG to be installed, please use this page to download and install GPG");
        ui.showDownloadpage();
        return false;
      }
      version = info.split('\n').shift().split(" ").pop().trim();
      sessionStorage['gpg.version'] = version;
    }

    //This might be over the top, but this is personal use for now
    if (version != "2.2.17") {
      console.log(info, version);
      alert("This application only supports PGP version 2.2.17");
      return false;
    }
    return true;
  }

  function getKeys() {
    //This will only show keys for which is there a public counterpart
    const getKeys = "gpg --list-secret-keys --keyid-format LONG";
    //If we dont run a supported GPG version, then get out!
    if (!checkVersion())
      return [""];
    //Return the keys we get from gpg, after we log
    return tmp.log(execSync(getKeys, utf8Encoding)).split('\n');
  }

  function deleteKey(id) {
    //We need to delete the private and the public key for this to work well
    const deleteKey1 = `gpg --batch --yes --delete-secret-key ${id}`;
    const deleteKey2 = `gpg --batch --yes --delete-key ${id}`;
    //Do it!!
    tmp.log(execSync(deleteKey1, utf8Encoding));
    tmp.log(execSync(deleteKey2, utf8Encoding));
  }

  function exportKey(id, cwd) {
    cwd = cwd || ".";
    //This will only show keys for which is there a public counterpart
    //gpg --batch --yes --passphrase="Z3cr3ts" --pinentry-mode loopback --output mygpgkey_sec.gpg --armor --export-secret-key 1C06A99628EE42428941A84F626A32EB2AB41BB7
    //gpg --output mygpgkey_sec.gpg --armor --export-secret-key 1C06A99628EE42428941A84F626A32EB2AB41BB7
    //gpg --output mygpgkey_pub.gpg --armor --export 1C06A99628EE42428941A84F626A32EB2AB41BB7
    const key = keys.getById(keys.getSelectedKeyId());
    const options = {
      encoding: "utf8",
      cwd
    };
    //Provide the key if we "know" it, otherwise let the GPG deal with that mess
    if (key.custom == "Default") {
      tmp.log(execSync(`gpg --batch --yes --passphrase="Z3cr3ts" --pinentry-mode loopback --output ${key.purpose}.key.def.gpg --armor --export-secret-key  ${id}`, options));
    } else {
      tmp.log(execSync(`gpg --output ${key.purpose}.key.gpg --armor --export-secret-key  ${id}`, options));
    }
  }

  function importKey(fn) {
    if (fn.endsWith("def.gpg")) {
      tmp.log(execSync(`gpg --batch --yes --passphrase="Z3cr3ts" --pinentry-mode loopback --import ${fn}`));
    } else {
      tmp.log(execSync(`gpg --import ${fn}`));
    }
  }


  function createKey(purpose, user, passphrase) {
    //This will only show keys for which is there a public counterpart
    const createKey = "gpg --batch --generate-key spec";
    //If we dont run a supported GPG version, then get out!
    if (!checkVersion())
      return;
    passphrase = passphrase || "Z3cr3ts";
    user = user || "zecrets@taryss.fr";
    //Return the keys we get from gpg

    const hasDefaultPassword = passphrase == "Z3cr3ts" ? "[quick]" : "[slow]";
    let lines = "";
    lines += `#To create a new key; gpg --batch --generate-key spec\n`;
    lines += `%echo Generating an encryption key for Zecrets\n`;
    lines += `Key-Type: default\n`;
    lines += `Subkey-Type: default\n`;
    lines += `Name-Real: ${purpose}\n`;
    lines += `Name-Comment: [Zecrets]${hasDefaultPassword}\n`;
    lines += `Name-Email: ${user}\n`;
    lines += `Expire-Date: 0\n`;
    lines += `Passphrase: ${passphrase}\n`;
    lines += `%commit\n`;
    lines += `%echo done`;

    fs.writeFileSync("spec", lines);
    tmp.log(execSync(createKey, utf8Encoding));
  }

  return {
    checkVersion,
    importKey,
    exportKey,
    createKey,
    deleteKey,
    getKeys,
  };

})();
