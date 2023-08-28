"use strict";

const TweakPaneManager = (function(){
    const tweakPaneFolders = {};
    let lastTweakPaneFolderIDCreated = -1;

    /**
     * @type {Tweakpane.TabPageApi}
     */
    let pane;
    return {
        system_preloadOnce:function(){
            const scene = GameContextHolder.scene;
            pane = scene.inspectorGame.pane;
            pane.expanded = false;
        },
        createFolder: function(title, {expanded= false} = {}) {
            const tweakPaneFolderID = ++lastTweakPaneFolderIDCreated;
            Logger.log("Creating new TweakPane folder", tweakPaneFolderID, title, expanded);
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
        system_unloadLevel: function() {
            Logger.log("Resetting TweakPaneManager. TODO: Needs more work here");
        }
    };
}());
