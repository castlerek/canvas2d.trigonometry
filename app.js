( function( globalContext ) {
    "use strict";

    /**
     * @const
     * @private
     * @type { string }
     */
    const canvasDomId = "coordinate-plane";

    /**
     * @event Window#onload
     * @type { function }
     *
     * @param { Event } event - Provides the sender object from the `onload` event of the global context object
     * @returns { undefined } - Nothing to return
     */
    globalContext.onload = function( event ) {
        let chart = new Chart();
        chart.setCanvas( canvasDomId );
        chart.render();
    };

})( window );