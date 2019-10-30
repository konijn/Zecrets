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

//All key functionality

/*jshint esversion: 6 */

function Keys(lines){
  this.list = [];

  if(!lines)
  return;

  //First line is location of the ring
  this.setRing(lines.shift());
  //Second line is just hypens
  lines.shift();
  //Last line messes this up, get rid of it
  lines.pop();
  //Now we get the keys
  let key = this.new();
  for(const line of lines){
    //Technical details of key
    if(line.startsWith("sec")){
      key.sec = line.slice(3).trim();
      key.date = key.sec.split(" ")[1].trim();
    }
    //ID of the key
    if(line.startsWith("      ")){
      key.id = line.trim();
    }
    //User of the key
    if(line.startsWith("uid")){
      key.user = line.slice(3).trim();
      const lastLT = key.user.lastIndexOf('<');
      const firstCSB = key.user.indexOf(']');
      key.custom = ~line.indexOf("[quick]") ? "Default" : "Custom";
      key.email = key.user.substring(lastLT).shift().pop();
      key.purpose = key.user.slice(firstCSB+1,lastLT).trim().split("([Zecrets]")[0].trim();
    }
    //End of user, collect it, and start again
    if(line.charCodeAt(0) == 13){
      this.list.push(key);
      key = this.new();
    }
  }
}

Keys.prototype.add = function keysAdd(key){
  this.list.push(key);
};

Keys.prototype.setRing = function keysSetRing(s){
  this.ring = s;
};

Keys.prototype.new = function keysNew(){
  return {};
};

Keys.prototype.count = function keysCount(){
  return this.list.length;
};

Keys.prototype.hasPurpose = function keysHasPurpose(purpose){
  return this.list.some(key=>key.purpose==purpose);
};

Keys.prototype.getSelectedKeyId = function keysGetSelectedKeyId(){
  if(!this.list.length){
    localStorage.removeItem("lastSelectedId");
    return "0";
  }
  let id = localStorage.getItem("lastSelectedId");
  id = this.list.some(key=>key.id==id)?id:this.list.sort((a,b)=>(new Date(a.date))*1 - (new Date(a.date))*1).last().id;
  localStorage.setItem("lastSelectedId", id);
  return id;
};

Keys.prototype.show = function keysShow(e){
  let html = `<div id="keysCrumble" class=scrollable>`;
  html += 'Encryption keys<br>';
  const listByDates = this.list.sort((a,b)=>(new Date(a.date))*1 - (new Date(a.date))*1);
  const selectedId = this.getSelectedKeyId();

  html += `<img src="encrypt.png"><key id="key_000000">Create a new key</key><br>`;
  for(const key of listByDates){

    if(key.id == selectedId){
      html += `<img src="decrypt.png"><key id="key_${key.id}"><b>${key.purpose}</b></key><br>`;
    }else{
      html += `<img src="encrypt.png"><key id="key_${key.id}">${key.purpose}</key><br>`;
    }
  }
  html += '</div>';
  e.innerHTML = html;

  electrician.wireKeys(document, controller.keyClicked);
};

Keys.prototype.showKey = function keysShowOnekey(id, e){
  if(id == "000000"){
    return this.showNewKey(e);
  }
  let key = this.list.filter(key=>key.id==id).last();

  mold.element("#" + e.id, "key.xml", key);

  electrician.wireClick("#deleteKey", this.deleteKey);
  electrician.wireClick("#activateKey", this.activateKey);
  electrician.wireClick("#exportKey", this.exportKey);

  electrician.wireField("#fileDialog", this.exportKey2);

  if(id==this.getSelectedKeyId()){
    ui.hide("#activateKey");
  }
};

Keys.prototype.activateKey = function keysActivateKey(){
  localStorage.setItem("lastSelectedId", ui.text("id"));
  keys.show(ui.$("#keysCrumble").parentElement);
  ui.hide("#activateKey");
  ui.$("#key_" + ui.text("id")).scrollIntoViewIfNeeded();
};

/* The click event is not async, so we take over in exportKey2
when a folder is selected */
Keys.prototype.exportKey = function keysExportKey(){
  $("fileDialog").click();
};

/*Part 2 of the export sage*/
Keys.prototype.exportKey2 = function keysExportKey(){
  const path = ui.value("fileDialog");
  if(path){
    gpg.exportKey(ui.text("id"), path);
  }
};

Keys.prototype.getById = function keysGetBydId(id){
  return this.list.filter(key=>key.id==id).last();
};

Keys.prototype.deleteKey = function keysDeleteKey(){
    ui.startProgress(`Deleting GPG key`);
    gpg.deleteKey(ui.text("id"));
    checkKeys();
    ui.restoreEditor();
    ui.removeProgress();
};

Keys.prototype.showNewKey = function keysShowNewKey(e){

  const user = tmp.get("user", "zecrets@taryss.fr");
  const purpose = tmp.get("purpose", "diary");
  const passphrase= tmp.get("passphrase", "Z3cr3ts");

  mold.element("#" + e.id, "newKey.xml", {user, purpose, passphrase});

  ui.focus("#purpose");

  electrician.wireClick("#createKey", keys.createKey);
  electrician.wireClick("#cancelKeyCreation", keys.cancelKeyCreation);
};

Keys.prototype.createKey = function keysCreateKey() {
  console.log("creatin' key");
  const purpose = ui.value('purpose');
  const user = ui.value('user');
  const passphrase = ui.value('passphrase');
  if(!purpose.trim()){
    return ui.oops("Purpose must be entered");
  }
  if(keys.hasPurpose(purpose)){
    return ui.oops("There is already a key with that purpose");
  }
  ui.startProgress(`Creating a new GPG key`);
  gpg.createKey(purpose, user, passphrase);
  checkKeys();
  ui.restoreEditor();
  ui.removeProgress();
};

Keys.prototype.cancelKeyCreation = function keysCancelKeyCreation() {
  console.log("cancelin' key");
  tmp.setFromForm('purpose');
  tmp.setFromForm('user');
  tmp.setFromForm('passphrase');
  ui.restoreEditor();
};
