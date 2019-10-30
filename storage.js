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

const tmp = (function createTmpObject() {

  function setFromForm(id) {
    sessionStorage.setItem(id, document.getElementById(id).value);
  }

  function get(id, _default) {
    return sessionStorage.getItem(id) || _default;
  }

  function set(id, value) {
    sessionStorage.setItem(id, value);
  }

  function log(stream) {
    set('log', get('log', '') + stream);
    return stream;
  }

  return {
    setFromForm,
    set,
    get,
    log
  };

})();
