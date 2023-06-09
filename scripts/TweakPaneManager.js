﻿"use strict";

const TweakPaneManager = (function(){
    const tweakPaneFolders = {};
    let lastTweakPaneFolderIDCreated = -1;
    let pane;
    return {
        system_create:function(){
            const gameContext = GameContextHolder.scene;
            pane = gameContext.inspectorGame.pane;
        },
        createFolder: function(title, {expanded= true} = {}) {
            const tweakPaneFolderID = lastTweakPaneFolderIDCreated + 1;
            const paneFolder = pane.addFolder({title: title, expanded: expanded});
            tweakPaneFolders[tweakPaneFolderID] = paneFolder;
            return tweakPaneFolderID;
        },
        createInputInFolder: function(folderID, obj, property) {
            const folder = tweakPaneFolders[folderID];
            folder.addInput(obj, property);
        },
        createMonitorInFolder: function(folderID, obj, property){
            const folder = tweakPaneFolders[folderID];
            folder.addMonitor(obj, property);
        },
        createSeparatorFolder: function(folderID){
            const folder = tweakPaneFolders[folderID];
            folder.addSeparator();
        },
        createButtonInFolder: function(folderID, text, onClick) {
            const folder = tweakPaneFolders[folderID];
            folder.addButton({title: text}).on('click', onClick);
        },
    };
}());
