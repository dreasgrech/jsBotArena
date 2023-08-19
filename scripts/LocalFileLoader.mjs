import {
    fileOpen,
    // directoryOpen,
    // fileSave,
    // supported
} from './lib/browser-fs-access@0.34.1/index.js';

/**
 * Used to load local files.
 * LocalFileLoader is attached to the window object so that it can be accessed from non-module scripts.
 * @type {{openFileDialog: ((function(*): Promise<void>)|*)}}
 */
window.LocalFileLoader = (function(){
    return {
        openFileDialog: async function(handleFileCallback) {
            let filesHandles;
            try {
                filesHandles = await fileOpen([
                    {
                        description: 'JavaScript files',
                        // mimeTypes: ['text/*'],
                        mimeTypes: ['text/javascript', 'text/plain'],
                        extensions: ['.js'],
                        multiple: true,
                    }
                ]);
            } catch (err) {
                Logger.error(err);
                // if (err.name !== 'AbortError') {
                // 	return console.error(err);
                // }
                return;
            }

            for (const filesHandle of filesHandles) {
                const filename = filesHandle.name;
                const fileSize = filesHandle.size;
                Logger.log(`Reading file: ${filename} (${fileSize} bytes)`);

                let text;
                try {
                    // Read the text from the file
                    text = await filesHandle.text();
                } catch (err) {
                    Logger.log(`Unable to read text: ${filename} (${fileSize} bytes). Exception: ${err}`);
                    continue;
                }

                handleFileCallback(filename, fileSize, text);
            }
        }
    };
}());
