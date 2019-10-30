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

//|| Array ||\\
//last() => return the content of the last array entry without popping
Array.prototype.last = function(){
  return this[this.length - 1];
};

//|| String ||\\
//pop(n) => pop n characters at the end, return the new string
String.prototype.pop = function(n){
  return this.slice(0, this.length - (n || 1));
};

//shift(n) => shift n characters at the front, return the new string
String.prototype.shift = function(n){
  return this.slice(n || 1);
};

//|| HTMLElement ||\\
//find(tag) => Return self if tag matches, otherwise first parent with that tag
HTMLElement.prototype.find = function(tagName){
  let e = this;
  while(e && e.tagName != tagName){
    e = e.parentElement;
  }
  return e.tagName == tagName? e : undefined;
};
