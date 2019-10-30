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

/*jshint esversion: 6 */

const controller = (function createController() {

  function init() {
    electrician.wireF5();
    mold.setFolder("./molds/");
    ui.restoreWindow(nw);
    ui.buildMenuBar(nw, controller.menuClicked);
    electrician.wireSizingRoutines();
    controller.checkKeys();
  }

  function menuClicked(e) {

    function labelToFunctionName(name) {
      let parts = name.split(' ');
      parts = parts.map(function lowerCaseAllButFirst(word, index) {
        if (index) {
          return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase();
        } else {
          return word.toLowerCase();
        }
      });

      return parts.join("");
    }

    const functionName = labelToFunctionName(this.label);
    console.log(this.label, `=>`, functionName);
    /*Wiring menu items straight to functions, living on the edge*/
    if (typeof controller[functionName] === 'function') {
      controller[functionName](e);
    }
  }

  function keyClicked(e){
    let cell = document.getElementById("zecretCell");
    let keyElement = e.srcElement.find('KEY');
    if(keyElement){
      keys.showKey(keyElement.id.substring(4), cell);
    }
  }

  function exitApplication(){
    nw.App.quit();
  }

  function respondToF5(e) {
    //console.log(e, e.keyCode);
    if (e.keyCode === 116) {
      chrome.runtime.reload();
    }
  }

  //Menubar function
  function createKey() {
    keys.showNewKey(ui.$("#zecretCell"));
  }

  //Menubar function
  function exportKey() {
    id = ui.text('id');
    if (id) {
      keys.exportKey();
    } else {
      alert("You need to display a key first by clicking on it");
    }
  }

  //Menubar function
  function checkKeys(e){
    ui.startProgress(`Checking keys with GPG`);
    keys = new Keys(gpg.getKeys());

    //Now, we are only interested in Zecrets keys
    keys.list = keys.list.filter(
      key=>!!~key.user.indexOf("([Zecrets]")
    );

    keys.show(document.getElementById("keys"));
    if(!keys.count() && e){
      alert("Could not find any Zecret keys, please generate a set of keys");
    }
    ui.removeProgress();
  }

  //Menubar function
  function importKey(){
    if(!ui.has("openDialog")){
      document.body.innerHTML += `<input type="file" id="openDialog" class="hidden">`;
    }
    electrician.wireField("saveAsDialog", controller.importKey2);
    ui.$("saveAsDialog").click();
  }

  function importKey2(e){
    console.log(ui.value("saveAsDialog"));
    fn = ui.value("saveAsDialog");
    if(fn){
      gpg.importKey(fn);
    }
    checkKeys(e);
  }

  return {
    init,
    respondToF5,
    menuClicked,
    keyClicked,
    importKey2,
    importKey,
    checkKeys,
    createKey
  };

})();
