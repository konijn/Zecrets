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

String.prototype.fillMold = function(id, value){
  let before;
  let after = this;
  let count = 0;
  return this.split("${" + id + "}").join(value || "");
};

function moldFromString(s, o){
  Object.keys(o).forEach(key => {s = s.fillMold(key, o[key]);});
  return s;
}

function moldFromFile(fileName, o){
  const fs = require('fs');
  const folder = moldFromFile.folder || ".";
  let content = fs.readFileSync(folder + "/" + fileName, 'utf8');
  return moldFromString(content, o);
}

function moldElementFromFile(selector, fileName, o){
  let e = document.querySelector(selector);
  e.innerHTML = moldFromFile(fileName, o);
}

function setMoldFolder(folder){
  moldFromFile.folder = folder;
}

const mold = {
  fromString: moldFromString,
  fromFile: moldFromFile,
  element: moldElementFromFile,
  setFolder: setMoldFolder
};
