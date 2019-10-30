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

function storeCurrentWindowSize(nw){
	var win = nw.Window.get();

	localStorage.setItem("width");
	localStorage.setItem("height");
}

function storeLocation(x,y){
	localStorage.setItem("x", x);
	localStorage.setItem("y", y);
}

function storeSize(w,h){
	localStorage.setItem("w", w);
	localStorage.setItem("h", h);
}

function storeMaximizedState(){
	localStorage.setItem("isMaximized", "yep");
}

function storeRestoredState(){
	localStorage.setItem("isMaximized", "nope");
}

function restoreWindow(nw){
	var win = nw.Window.get();
	const isMaximized = localStorage.getItem("isMaximized");
	if(!isMaximized){
		//The user has never moved the window ever
		return;
	}else if(isMaximized == "yep"){
		win.maximize();
	}else if(isMaximized == "nope"){
		//win.restore();
		win.x = localStorage.getItem("x")*1;
		win.y = localStorage.getItem("y")*1;
		win.width = localStorage.getItem("w")*1;
		win.height = localStorage.getItem("h")*1;
	}
}

function restoreEditor(){
	//<td id="zecretCell" rowspan="2"><textarea id="zecret"></textarea></td>
	let cell = document.getElementById('zecretCell');
	cell.innerHTML = '<textarea id="zecret"></textarea>';
}

function showDownloadpage(){
	let cell = document.getElementById('zecretCell');
	cell.innerHTML = '<iframe src="https://gnupg.org/download/#binary"></iframe>';
}

function buildMenuBar(nw, menuClicked){

	// Create an empty menubar
	var menuBar = new nw.Menu({type: 'menubar'});

	// Create a fileMenu as the 2nd level menu
	var fileMenu = new nw.Menu();
	const onClick = controller.menuClicked;
	fileMenu.append(new nw.MenuItem({ click: onClick, label: 'New File',        key: 'N', modifiers: 'ctrl'}));
	fileMenu.append(new nw.MenuItem({ click: onClick, label: 'Open File',        key: 'O', modifiers: 'ctrl'}));
	fileMenu.append(new nw.MenuItem({ click: onClick, label: 'Save File',        key: 'S', modifiers: 'ctrl' }));
	fileMenu.append(new nw.MenuItem({ click: onClick, label: 'Save File As',     key: 'S', modifiers: 'ctrl+shift' }));
	fileMenu.append(new nw.MenuItem({ click: onClick, label: 'Close File',       key: 'F4' }));
	fileMenu.append(new nw.MenuItem({ click: onClick, label: 'Exit Application', key: 'X', modifiers: 'ctrl' }));

	var keyMenu = new nw.Menu();
	keyMenu.append(new nw.MenuItem({ click: onClick, label: 'Check keys'}));
	keyMenu.append(new nw.MenuItem({ click: onClick, label: 'Create key'}));
	keyMenu.append(new nw.MenuItem({ click: onClick, label: 'Export key'}));
	keyMenu.append(new nw.MenuItem({ click: onClick, label: 'Import key'}));

	// Create and append the 1st level menu to the menubar
	menuBar.append(new nw.MenuItem({label: 'File', key: 'F', modifiers: 'ctrl', submenu: fileMenu}));
	menuBar.append(new nw.MenuItem({label: 'Keys', key: 'K', modifiers: 'ctrl', submenu: keyMenu}));

	// Assign it to `window.menu` to get the menu displayed
	nw.Window.get().menu = menuBar;

}

function  formValue(id, value){
	let e = $(id);
	if(value!=undefined){
		e.value = value;
	}
	return e.value;
}

function textValue(selector, value){
	const e = ui.$(selector);
	if(e){
		if(value!=undefined){
			e.textContent = value;
		}
		return e.textContent;
	}
}

function $(selector){
	return selector.startsWith("#") ? document.querySelector(selector) : (document.querySelector(selector) || document.querySelector("#" + selector));
}

function oops(message){
	const element = document.getElementById('oops');
  if(element){
		element.innerHTML = s;
	}else{
		alert(message);
	}
}

function focus(selector){
	document.querySelector(selector).focus();
}
/*
  Using progress requires 2 step:
  ui.startProgress(`Super informative progress message`);
  ui.removeProgress();
*/
function startProgress(message){
	const html = `<div class="progress">${message}</div>`;
	document.body.style.cursor = 'wait';
	document.body.innerHTML += html;
	document.body.style.opacity = "50%";
}

function removeProgress(){
	const elements = document.getElementsByClassName('progress');
	elements[0].parentNode.removeChild(elements[0]);
	document.body.style.opacity = "100%";
	document.body.style.cursor = 'default';
}

function hide(selector){
	$(selector).style.display = "none";
}

function display(selector, fashion){
	const e = $(selector);
	if(e) e.style.display = fashion || "auto";
}

function addClass(selector, className){
	const e = $(selector);
	if(e) e.classList.add(className);
}

function removeClass(selector, className){
	const e = $(selector);
	if(e) e.classList.remove(className);
}

function has(selector){
	return !!ui(selector);
}

const ui = {
	storeSize,
	addClass,
	removeClass,
	storeLocation,
	startProgress,
	removeProgress,
	storeMaximizedState,
	storeRestoredState,
	restoreWindow,
	buildMenuBar,
	restoreEditor,
	showDownloadpage,
	value: formValue,
	text: textValue,
	focus,
	hide,
	oops,
	has,
	$
};
