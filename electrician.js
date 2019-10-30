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


const electrician = (function birthElectrian(nw) {

  //wireKeys => wire the key elements in the top left corner to a listener
  function wireKeys(document, listener) {
    const keyElements = document.getElementsByTagName("KEY");
    for (let e of keyElements) {
      e.addEventListener("click", listener);
    }
  }

  //wireSizingRoutines => Wire the window sizing events to storage routines
  //to be used later by restore routines
  function wireSizingRoutines() {
    const win = nw.Window.get();
    win.on("move", ui.storeLocation);
    win.on("resize", ui.storeSize);
    win.on("maximize", ui.storeMaximizedState);
    win.on("restore", ui.storeRestoredState);
  }

  function wireF5() {
    window.addEventListener('keyup', controller.respondToF5);
  }

  function wireClick(s, f) {
    //document.querySelector(s).addEventListener("click", f);
    ui.$(s).addEventListener("click", f);
  }

  function wireField(s, f) {
    ui.$(s).addEventListener("input", f);
  }

  return {
    wireF5,
    wireKeys,
    wireSizingRoutines,
    wireClick,
    wireField
  };

})(nw);
