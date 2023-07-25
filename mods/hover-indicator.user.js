// ==UserScript==
// @name         Hover Indicator
// @namespace    https://github.com/aclist
// @version      0.1.0
// @description  applies a outline to hovered elements
// @author       minnieo
// @match        https://kbin.social/*
// @license      MIT
// ==/UserScript==

let styleElement;

function applyOutlines() {
    // user customizable vars
    const settings = getModSettings('hover');
    const color = settings.color;
    const thickness = settings.thickness;

    // remove the existing style element if it exists
    if (styleElement && styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
    }

    // apply outlines to elements
    const selectors = 'a:hover, h1:hover, h2:hover, h3:hover, h4:hover, h5:hover, h6:hover, img:hover, button:hover, label:hover, markdown-toolbar:hover, textarea:hover, i:hover, time:hover, small:hover, div.content:hover, ul:hover, li:hover, span:hover, figure:hover, input:hover';
    const outline = `${selectors} { outline: ${thickness}px solid ${color};}`;
    const border = `p:not(div.content p):hover { border: ${thickness}px solid ${color};}`;

    styleElement = document.createElement('style');
    styleElement.innerText = outline + border;
    document.head.appendChild(styleElement);
}

function hoverIndicator(toggle) {
    if (toggle) {
        applyOutlines();
    } else {
        document.head.removeChild(styleElement);
    }
}