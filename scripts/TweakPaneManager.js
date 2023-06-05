"use strict";

const TweakPaneManager = (function(){
    const tweakPaneFolders = {};
    let gameContext;
    let lastTweakPaneFolderIDCreated = -1;
    let pane;
    const tweakPaneManager = {
        system_create:function(){
            const gameContext = GameContextHolder.gameContext;
            pane = gameContext.inspectorGame.pane;
        },
        createFolder: function(title){
            const tweakPaneFolderID = lastTweakPaneFolderIDCreated + 1;
            const paneFolder = pane.addFolder({title: title});
            tweakPaneFolders[tweakPaneFolderID] = paneFolder;
            return tweakPaneFolderID;
        }
    };
    return tweakPaneManager;
}());
