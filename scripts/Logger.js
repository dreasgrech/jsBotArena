"use strict";

const Logger = (function() {
    const SHOW_FILE_AND_LINE_INFO = true;

    const getFrameCount = function(text) {
        return `<${FrameCounter.current}>`;
    };

    const getTimestamp = function () {
        const now = new Date();

        const hours = now.getHours().toString().padStart(2, '0'),
            minutes = now.getMinutes().toString().padStart(2, '0'),
            seconds = now.getSeconds().toString().padStart(2, '0'),
            milliseconds = now.getMilliseconds().toString().padStart(3, '0');

        return `[${hours}:${minutes}:${seconds}.${milliseconds}]`;
    };

    const getCallerInfo = function () {
        const error = new Error();
        const stack = error.stack.split('\n');
        //console.log(stack);
        const callerStack = stack[4]; // Get the relevant stack trace line (adjust this number if necessary)
        const match = callerStack.match(/(\S+):(\d+):(\d+)/);

        if (match) {
            const file = match[1];
            const lineNumber = match[2];
            return `${file}:${lineNumber})`;
        } else {
            return 'unknown';
        }
    };

    const callConsole = function(operation) {
        // Skip the operation arg so that we just have the logging arguments array-like object
        var logArgs = arguments[1];

        // Show the file and line number
        if (SHOW_FILE_AND_LINE_INFO) {
            const callerInfo = getCallerInfo();
            Array.prototype.unshift.call(logArgs, callerInfo);
        }

        Array.prototype.unshift.call(logArgs, getFrameCount());
        Array.prototype.unshift.call(logArgs, getTimestamp());

        //// Show the file and line number
        //if (SHOW_FILE_AND_LINE_INFO) {
        //    const callerInfo = getCallerInfo();
        //    Array.prototype.push.call(logArgs, callerInfo);
        //}

        console[operation].apply(console, logArgs);
    };

    const obj = {
        log: function() {
            callConsole('log', arguments);
        },
        warn: function() {
            callConsole('warn', arguments);
        },
        error: function() {
            callConsole('error', arguments);
        }
    };

    return obj;
}());
