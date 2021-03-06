"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElectronShims = void 0;

var _electron = require("electron");

/**
 * This is where type definitions for electron will be copied over for typescript typings
 * It appears that loading electron in the capacity for testing for which browser bus causes issues
 * Truthfully we need only a few methods for the BrowserWindow, BrowserView, and <webview>
 */
var ElectronShims;
exports.ElectronShims = ElectronShims;

(function (_ElectronShims) {})(ElectronShims || (exports.ElectronShims = ElectronShims = {}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zaGltcy9lbGVjdHJvbi1zaGltcy50cyJdLCJuYW1lcyI6WyJFbGVjdHJvblNoaW1zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBTUM7O0FBTkQ7Ozs7Ozs7OytCQVFpQkEsYSw2QkFBQUEsYSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhpcyBpcyB3aGVyZSB0eXBlIGRlZmluaXRpb25zIGZvciBlbGVjdHJvbiB3aWxsIGJlIGNvcGllZCBvdmVyIGZvciB0eXBlc2NyaXB0IHR5cGluZ3NcbiAqIEl0IGFwcGVhcnMgdGhhdCBsb2FkaW5nIGVsZWN0cm9uIGluIHRoZSBjYXBhY2l0eSBmb3IgdGVzdGluZyBmb3Igd2hpY2ggYnJvd3NlciBidXMgY2F1c2VzIGlzc3Vlc1xuICogVHJ1dGhmdWxseSB3ZSBuZWVkIG9ubHkgYSBmZXcgbWV0aG9kcyBmb3IgdGhlIEJyb3dzZXJXaW5kb3csIEJyb3dzZXJWaWV3LCBhbmQgPHdlYnZpZXc+XG4gKi9cblxuIGltcG9ydCB7IFdlYkNvbnRlbnRzLCBDb29raWUgfSBmcm9tIFwiZWxlY3Ryb25cIjtcblxuZXhwb3J0IG5hbWVzcGFjZSBFbGVjdHJvblNoaW1zIHtcbiAgZXhwb3J0IGludGVyZmFjZSBXZWJDb250ZW50c0xpa2UgZXh0ZW5kcyBFbGVjdHJvbi5XZWJDb250ZW50cyB7XG5cbiAgfVxuXG4gIGV4cG9ydCBpbnRlcmZhY2UgQnJvd3NlcldpbmRvd1ZpZXdMaWtlIHtcbiAgICB3ZWJDb250ZW50czogV2ViQ29udGVudHNMaWtlXG4gIH1cblxuICBleHBvcnQgaW50ZXJmYWNlIFdlYnZpZXdUYWdMaWtlIGV4dGVuZHMgRWxlY3Ryb24uV2Vidmlld1RhZyB7fVxuXG4gIGV4cG9ydCBpbnRlcmZhY2UgQ29va2llIGV4dGVuZHMgRWxlY3Ryb24uQ29va2llIHt9XG59Il19